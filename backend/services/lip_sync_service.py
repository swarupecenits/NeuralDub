"""
Lip Sync Service - MuseTalk Integration
Handles video lip-syncing using MuseTalk models
"""

import os
import sys
import torch
import logging
import numpy as np
from pathlib import Path
from typing import Optional, Dict, Tuple
import cv2

logger = logging.getLogger(__name__)


class LipSyncService:
    """
    Service for lip-syncing videos using MuseTalk
    """
    
    def __init__(self, musetalk_path: str, models_dir: str, device: str = 'cuda'):
        """
        Initialize the MuseTalk lip sync service
        
        Args:
            musetalk_path: Path to MuseTalk installation directory
            models_dir: Path to MuseTalk models directory
            device: Device to use ('cuda' or 'cpu')
        """
        self.musetalk_path = Path(musetalk_path)
        self.models_dir = Path(models_dir)
        self.device = device if torch.cuda.is_available() and device == 'cuda' else 'cpu'
        
        # Initialize state
        self.models_loaded = False
        self.load_error = None
        
        # Model components (will be loaded lazily)
        self.audio_processor = None
        self.vae = None
        self.unet = None
        self.pe = None
        
        logger.info(f"Initializing LipSyncService on device: {self.device}")
        
        # Add MuseTalk to Python path
        if str(self.musetalk_path) not in sys.path:
            sys.path.insert(0, str(self.musetalk_path))
        
        # Attempt to load models
        try:
            self._load_models()
            self.models_loaded = True
            logger.info("MuseTalk models loaded successfully")
        except Exception as e:
            self.load_error = str(e)
            logger.error(f"Failed to load MuseTalk models: {e}")
            logger.warning("Lip sync service initialized but models not loaded")
    
    def _load_models(self):
        """Load all required MuseTalk models"""
        try:
            # Import MuseTalk utilities
            from musetalk.utils.audio_processor import AudioProcessor
            from musetalk.utils.face_parsing import FaceParsing
            from diffusers import AutoencoderKL, UNet2DConditionModel
            from diffusers.models.embeddings import TimestepEmbedding
            import json
            
            logger.info(f"Loading MuseTalk models from: {self.models_dir}")
            
            # Check if models directory exists
            if not os.path.exists(self.models_dir):
                raise FileNotFoundError(f"Models directory not found: {self.models_dir}")
            
            # Load VAE
            logger.info("Loading VAE model...")
            vae_path = os.path.join(self.models_dir, "sd-vae-ft-mse")
            if not os.path.exists(vae_path):
                raise FileNotFoundError(f"VAE model not found at: {vae_path}")
            self.vae = AutoencoderKL.from_pretrained(vae_path).to(self.device)
            logger.info("VAE loaded successfully")
            
            # Load UNet
            logger.info("Loading UNet model...")
            unet_config_path = os.path.join(self.models_dir, "musetalk", "musetalk.json")
            if not os.path.exists(unet_config_path):
                # Try v15
                unet_config_path = os.path.join(self.models_dir, "musetalkV15", "musetalk.json")
            
            if not os.path.exists(unet_config_path):
                raise FileNotFoundError(f"UNet config not found in models directory")
            
            with open(unet_config_path, 'r') as f:
                unet_config = json.load(f)
            
            self.unet = UNet2DConditionModel(**unet_config).to(self.device)
            
            # Load UNet weights if available
            unet_weights_path = os.path.join(self.models_dir, "musetalkV15", "unet.pth")
            if os.path.exists(unet_weights_path):
                logger.info(f"Loading UNet weights from: {unet_weights_path}")
                unet_weights = torch.load(unet_weights_path, map_location=self.device)
                self.unet.load_state_dict(unet_weights)
            logger.info("UNet loaded successfully")
            
            # Load position encoding (PE)
            logger.info("Loading position encoding...")
            pe_path = os.path.join(self.models_dir, "musetalk/positional_encoding.pth")
            if os.path.exists(pe_path):
                self.pe = torch.load(pe_path, map_location=self.device)
            else:
                # Use default if not found
                logger.warning("Position encoding not found, using default")
                self.pe = TimestepEmbedding(320, 1024).to(self.device)
            logger.info("Position encoding loaded")
            
            # Load audio processor
            logger.info("Loading audio processor...")
            whisper_path = os.path.join(self.models_dir, "whisper")
            if not os.path.exists(whisper_path):
                raise FileNotFoundError(f"Whisper model not found at: {whisper_path}")
            self.audio_processor = AudioProcessor(whisper_path)
            logger.info("Audio processor loaded successfully")
            
            # Load face parsing
            logger.info("Loading face parsing model...")
            face_parse_path = os.path.join(self.models_dir, "face-parse-bisent", "79999_iter.pth")
            if not os.path.exists(face_parse_path):
                logger.warning("Face parsing model not found, will use default")
            # FaceParsing will auto-load the model from the standard location
            self.face_parsing = FaceParsing()
            logger.info("Face parsing loaded")
            
            logger.info("All models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            logger.exception(e)
            raise
    
    def check_models(self) -> bool:
        """
        Check if models are properly loaded
        
        Returns:
            bool: True if models are ready, False otherwise
        """
        return self.models_loaded and all([
            self.audio_processor is not None,
            self.vae is not None,
            self.unet is not None,
            self.pe is not None
        ])
    
    def preprocess_video(self, video_path: str, output_dir: str) -> Dict:
        """
        Preprocess video to extract avatar information
        
        Args:
            video_path: Path to input video
            output_dir: Directory to save preprocessed data
            
        Returns:
            Dict with avatar information and paths
        """
        try:
            from musetalk.utils.preprocessing import get_landmark_and_bbox, read_imgs
            from musetalk.utils.preprocessing import coord_placeholder, get_bbox_range
            
            logger.info(f"Preprocessing video: {video_path}")
            
            # Create output directory
            os.makedirs(output_dir, exist_ok=True)
            
            # Read video frames
            input_img_list = read_imgs(video_path)
            logger.info(f"Read {len(input_img_list)} frames from video")
            
            # Get landmarks and bounding boxes
            coord_list, frame_list = get_landmark_and_bbox(input_img_list, bbox_shift=0)
            
            if not coord_list:
                raise ValueError("No faces detected in video")
            
            # Get bbox range
            bbox = get_bbox_range(coord_list)
            
            # Save avatar info
            avatar_info = {
                'bbox': bbox,
                'frame_list': frame_list,
                'coord_list': coord_list,
                'video_path': video_path,
                'output_dir': output_dir
            }
            
            logger.info("Video preprocessing completed successfully")
            return avatar_info
            
        except Exception as e:
            logger.error(f"Error preprocessing video: {e}")
            raise
    
    def generate_lip_sync(
        self,
        video_path: str,
        audio_path: str,
        output_path: str,
        bbox_shift: int = 0,
        progress_callback=None
    ) -> Dict:
        """
        Generate lip-synced video
        
        Args:
            video_path: Path to input video file
            audio_path: Path to input audio file
            output_path: Path to save output video
            bbox_shift: Bounding box shift parameter
            progress_callback: Optional callback function(progress, stage) for progress updates
            
        Returns:
            Dict with result information
        """
        if not self.check_models():
            error_msg = f"Models not loaded: {self.load_error or 'Unknown error'}"
            logger.error(error_msg)
            return {
                'success': False,
                'error': error_msg
            }
        
        try:
            if progress_callback:
                progress_callback(5, 'Initializing...')
            
            logger.info(f"Starting lip sync generation")
            logger.info(f"Video: {video_path}")
            logger.info(f"Audio: {audio_path}")
            logger.info(f"Output: {output_path}")
            
            # Import MuseTalk inference
            from scripts.inference import main as musetalk_main
            from omegaconf import OmegaConf
            import argparse
            
            # Create temp directory structure
            temp_dir = os.path.join(os.path.dirname(output_path), 'temp_musetalk')
            os.makedirs(temp_dir, exist_ok=True)
            
            # Create inference config
            input_basename = os.path.basename(video_path).split('.')[0]
            audio_basename = os.path.basename(audio_path).split('.')[0]
            output_basename = f"{input_basename}_{audio_basename}"
            
            if progress_callback:
                progress_callback(10, 'Preparing inference configuration...')
            
            # Save inference config
            config_path = os.path.join(temp_dir, 'inference_config.yaml')
            config_content = {
                'task1': {
                    'video_path': video_path,
                    'audio_path': audio_path,
                    'bbox_shift': bbox_shift,
                    'result_name': os.path.basename(output_path)
                }
            }
            OmegaConf.save(config_content, config_path)
            
            if progress_callback:
                progress_callback(15, 'Loading models...')
            
            # Create args namespace to pass to MuseTalk main function
            args = argparse.Namespace(
                ffmpeg_path='',  # Use system ffmpeg
                gpu_id=0,  # MuseTalk will choose cuda:0 or cpu based on availability
                vae_type='sd-vae-ft-mse',
                unet_config=os.path.join(self.models_dir, 'musetalk', 'musetalk.json'),
                unet_model_path=os.path.join(self.models_dir, 'musetalkV15', 'unet.pth'),
                whisper_dir=os.path.join(self.models_dir, 'whisper'),
                inference_config=config_path,
                bbox_shift=bbox_shift,
                result_dir=os.path.dirname(output_path),
                extra_margin=10,
                fps=25,
                audio_padding_length_left=2,
                audio_padding_length_right=2,
                batch_size=8,
                output_vid_name=os.path.basename(output_path),
                use_saved_coord=False,
                saved_coord=False,
                use_float16=False,
                parsing_mode='jaw',
                left_cheek_width=90,
                right_cheek_width=90,
                version='v15'
            )
            
            if progress_callback:
                progress_callback(20, 'Processing video and extracting landmarks...')
            
            # Run MuseTalk inference
            logger.info("Running MuseTalk inference...")
            musetalk_main(args)
            
            if progress_callback:
                progress_callback(90, 'Finalizing output video...')
            
            # MuseTalk saves output in a version subdirectory (v15/)
            actual_output_path = os.path.join(os.path.dirname(output_path), 'v15', os.path.basename(output_path))
            
            # Check if output file was created in the v15 subdirectory
            if not os.path.exists(actual_output_path):
                raise Exception(f"Output file not created at {actual_output_path}")
            
            # Move the file to the expected location
            import shutil
            shutil.move(actual_output_path, output_path)
            
            if progress_callback:
                progress_callback(95, 'Cleaning up temporary files...')
            
            # Clean up the v15 directory if empty
            v15_dir = os.path.join(os.path.dirname(output_path), 'v15')
            if os.path.exists(v15_dir) and not os.listdir(v15_dir):
                os.rmdir(v15_dir)
            
            logger.info("Lip sync generation completed successfully")
            logger.info(f"Output file size: {os.path.getsize(output_path)} bytes")
            
            return {
                'success': True,
                'output_path': output_path,
                'message': 'Lip sync completed successfully'
            }
            
        except Exception as e:
            error_msg = f"Error during lip sync generation: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return {
                'success': False,
                'error': error_msg
            }
    
    def process_batch(
        self,
        video_audio_pairs: list,
        output_dir: str
    ) -> Dict:
        """
        Process multiple video-audio pairs
        
        Args:
            video_audio_pairs: List of (video_path, audio_path) tuples
            output_dir: Directory to save outputs
            
        Returns:
            Dict with batch processing results
        """
        results = []
        
        for idx, (video_path, audio_path) in enumerate(video_audio_pairs):
            output_name = f"lip_sync_result_{idx}.mp4"
            output_path = os.path.join(output_dir, output_name)
            
            result = self.generate_lip_sync(
                video_path=video_path,
                audio_path=audio_path,
                output_path=output_path
            )
            
            results.append({
                'index': idx,
                'video': video_path,
                'audio': audio_path,
                'result': result
            })
        
        return {
            'total': len(video_audio_pairs),
            'results': results
        }
    
    def validate_inputs(self, video_path: str, audio_path: str) -> Tuple[bool, Optional[str]]:
        """
        Validate input files
        
        Args:
            video_path: Path to video file
            audio_path: Path to audio file
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check video file
        if not os.path.exists(video_path):
            return False, f"Video file not found: {video_path}"
        
        video_ext = os.path.splitext(video_path)[1].lower()
        valid_video_exts = ['.mp4', '.avi', '.mov', '.mkv', '.webm']
        if video_ext not in valid_video_exts:
            return False, f"Invalid video format. Supported: {', '.join(valid_video_exts)}"
        
        # Check audio file
        if not os.path.exists(audio_path):
            return False, f"Audio file not found: {audio_path}"
        
        audio_ext = os.path.splitext(audio_path)[1].lower()
        valid_audio_exts = ['.mp3', '.wav', '.m4a', '.aac', '.ogg']
        if audio_ext not in valid_audio_exts:
            return False, f"Invalid audio format. Supported: {', '.join(valid_audio_exts)}"
        
        # Check file sizes
        video_size = os.path.getsize(video_path)
        audio_size = os.path.getsize(audio_path)
        
        max_video_size = 500 * 1024 * 1024  # 500 MB
        max_audio_size = 100 * 1024 * 1024  # 100 MB
        
        if video_size > max_video_size:
            return False, f"Video file too large. Maximum size: 500 MB"
        
        if audio_size > max_audio_size:
            return False, f"Audio file too large. Maximum size: 100 MB"
        
        return True, None
    
    def cleanup_temp_files(self, temp_dir: str):
        """
        Clean up temporary files
        
        Args:
            temp_dir: Directory containing temporary files
        """
        try:
            import shutil
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
                logger.info(f"Cleaned up temp directory: {temp_dir}")
        except Exception as e:
            logger.warning(f"Failed to cleanup temp files: {e}")


# Singleton instance
_lip_sync_service = None


def get_lip_sync_service(musetalk_path: str = None, models_dir: str = None, device: str = 'cuda'):
    """
    Get or create the lip sync service singleton
    
    Args:
        musetalk_path: Path to MuseTalk installation
        models_dir: Path to models directory
        device: Device to use
        
    Returns:
        LipSyncService instance
    """
    global _lip_sync_service
    
    if _lip_sync_service is None:
        if musetalk_path is None or models_dir is None:
            raise ValueError("musetalk_path and models_dir required for first initialization")
        
        _lip_sync_service = LipSyncService(musetalk_path, models_dir, device)
    
    return _lip_sync_service
