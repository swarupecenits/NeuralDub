"""
Whisper ASR Service
Handles speech-to-text conversion using OpenAI Whisper
"""

import whisper
import librosa
import numpy as np
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import time
import logging

logger = logging.getLogger(__name__)


class WhisperService:
    """Service for Whisper-based speech recognition"""
    
    def __init__(self, model_name: str = 'base', device: str = 'cuda'):
        """
        Initialize Whisper service
        
        Args:
            model_name: Whisper model size (tiny, base, small, medium, large)
            device: Device to run model on (cuda or cpu)
        """
        self.model_name = model_name
        self.device = device
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load Whisper model"""
        try:
            logger.info(f"Loading Whisper model: {self.model_name} on {self.device}")
            self.model = whisper.load_model(self.model_name, device=self.device)
            logger.info("Whisper model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {str(e)}")
            raise
    
    def transcribe(self, audio_path: str, language: Optional[str] = None) -> Dict:
        """
        Transcribe audio file to text
        
        Args:
            audio_path: Path to audio file (mp3, wav, ogg, m4a, flac)
            language: Language code (e.g., 'en', 'hi'). If None, auto-detect
        
        Returns:
            Dictionary with transcription results including:
            - text: Full transcribed text
            - language: Detected language code
            - segments: List of segments with timing and confidence
            - confidence: Average confidence score
            - duration: Audio duration in seconds
        """
        if not self.model:
            raise RuntimeError("Whisper model not loaded")
        
        start_time = time.time()
        
        try:
            # Validate audio file exists
            if not Path(audio_path).exists():
                raise FileNotFoundError(f"Audio file not found: {audio_path}")
            
            # Transcribe with language specification
            logger.info(f"Transcribing audio: {audio_path}")
            options = {
                'language': language if language and language != 'auto' else None,
                'verbose': False,
            }
            
            result = self.model.transcribe(audio_path, **options)
            
            # Extract metadata
            duration = self._get_audio_duration(audio_path)
            processing_time = time.time() - start_time
            
            # Calculate average confidence from segments
            confidences = [seg.get('confidence', 0.9) for seg in result.get('segments', [])]
            avg_confidence = np.mean(confidences) if confidences else 0.9
            
            return {
                'text': result['text'],
                'language': result['language'],
                'segments': result['segments'],
                'confidence': float(avg_confidence),
                'duration': duration,
                'processing_time': processing_time,
                'success': True
            }
        
        except Exception as e:
            logger.error(f"Transcription failed: {str(e)}")
            return {
                'text': '',
                'language': None,
                'segments': [],
                'confidence': 0,
                'duration': 0,
                'processing_time': time.time() - start_time,
                'success': False,
                'error': str(e)
            }
    
    def detect_language(self, audio_path: str) -> str:
        """
        Detect language in audio file
        
        Args:
            audio_path: Path to audio file
        
        Returns:
            Language code (e.g., 'en', 'hi')
        """
        if not self.model:
            raise RuntimeError("Whisper model not loaded")
        
        try:
            if not Path(audio_path).exists():
                raise FileNotFoundError(f"Audio file not found: {audio_path}")
            
            logger.info(f"Detecting language for: {audio_path}")
            
            # Load audio
            audio = whisper.load_audio(audio_path)
            
            # Detect language (take first 30 seconds)
            audio = whisper.pad_or_trim(audio)
            mel = whisper.log_mel_spectrogram(audio).to(self.model.device)
            
            _, probs = self.model.detect_language(mel)
            detected_lang = max(probs, key=probs.get)
            
            logger.info(f"Detected language: {detected_lang}")
            return detected_lang
        
        except Exception as e:
            logger.error(f"Language detection failed: {str(e)}")
            return 'en'  # Default to English
    
    @staticmethod
    def _get_audio_duration(audio_path: str) -> float:
        """Get audio duration in seconds"""
        try:
            y, sr = librosa.load(audio_path, sr=None)
            duration = librosa.get_duration(y=y, sr=sr)
            return float(duration)
        except Exception as e:
            logger.warning(f"Could not determine audio duration: {str(e)}")
            return 0.0
    
    def validate_audio_file(self, file_path: str) -> Tuple[bool, Optional[str]]:
        """
        Validate audio file
        
        Args:
            file_path: Path or filename of audio file
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        valid_extensions = {'.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.webm', '.mp4'}
        
        try:
            # Handle both full paths and just filenames
            filename = str(file_path)
            
            # Get file extension
            if '.' not in filename:
                return False, "File has no extension"
            
            ext = '.' + filename.rsplit('.', 1)[1].lower()
            
            # Check file extension
            if ext not in valid_extensions:
                return False, f"Unsupported format '{ext}'. Supported: {', '.join(valid_extensions)}"
            
            # If it's an actual path, check additional properties
            if Path(file_path).exists():
                path = Path(file_path)
                
                # Check file size (max 100MB to be more permissive)
                if path.stat().st_size > 100 * 1024 * 1024:
                    return False, "File size exceeds 100MB limit"
            
            return True, None
        
        except Exception as e:
            logger.error(f"Validation error: {str(e)}")
            return False, f"Validation error: {str(e)}"
    
    def transcribe_batch(self, audio_paths: List[str], language: Optional[str] = None) -> List[Dict]:
        """
        Transcribe multiple audio files
        
        Args:
            audio_paths: List of paths to audio files
            language: Language code (optional)
        
        Returns:
            List of transcription results
        """
        results = []
        for audio_path in audio_paths:
            result = self.transcribe(audio_path, language)
            results.append(result)
        return results
