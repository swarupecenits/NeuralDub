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
            from musetalk.utils.utils import load_all_model
            from musetalk.utils.audio_processor import AudioProcessor
            from musetalk.utils.face_parsing import FaceParsing
            
            logger.info("Loading MuseTalk models from: {}".format(self.models_dir))
            
            # Load all models using MuseTalk's utility function
            model_dict = load_all_model()
            
            self.audio_processor = model_dict.get('audio_processor')
            self.vae = model_dict.get('vae')
            self.unet = model_dict.get('unet')
            self.pe = model_dict.get('pe')
            
            # Load face parsing
            self.face_parsing = FaceParsing()
            
            logger.info("All models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
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
        bbox_shift: int = 0
    ) -> Dict:
        """
        Generate lip-synced video
        
        Args:
            video_path: Path to input video file
            audio_path: Path to input audio file
            output_path: Path to save output video
            bbox_shift: Bounding box shift parameter
            
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
            logger.info(f"Starting lip sync generation")
            logger.info(f"Video: {video_path}")
            logger.info(f"Audio: {audio_path}")
            logger.info(f"Output: {output_path}")
            
            # Import inference function
            from scripts.inference import inference
            
            # Create temp directory for avatar processing
            temp_dir = os.path.join(os.path.dirname(output_path), 'temp_avatar')
            os.makedirs(temp_dir, exist_ok=True)
            
            # Preprocess video
            avatar_info = self.preprocess_video(video_path, temp_dir)
            
            # Run inference
            logger.info("Running MuseTalk inference...")
            result = inference(
                audio_path=audio_path,
                video_path=video_path,
                bbox_shift=bbox_shift,
                result_dir=os.path.dirname(output_path),
                vae=self.vae,
                unet=self.unet,
                pe=self.pe,
                audio_processor=self.audio_processor,
                device=self.device
            )
            
            logger.info("Lip sync generation completed successfully")
            
            return {
                'success': True,
                'output_path': output_path,
                'avatar_info': avatar_info,
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
