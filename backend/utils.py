"""
Utility functions for the backend
"""

import os
import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


def ensure_logs_directory():
    """Ensure logs directory exists"""
    log_dir = Path('logs')
    log_dir.mkdir(exist_ok=True)
    return log_dir


def ensure_temp_directory():
    """Ensure temp directory exists for uploaded files"""
    temp_dir = Path('temp')
    temp_dir.mkdir(exist_ok=True)
    return temp_dir


def setup_directories():
    """Setup all necessary directories"""
    try:
        ensure_logs_directory()
        ensure_temp_directory()
        logger.info("All directories initialized successfully")
    except Exception as e:
        logger.error(f"Failed to setup directories: {str(e)}")
        raise


def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return Path(filename).suffix.lower()


def is_audio_file(filename: str) -> bool:
    """Check if file is a supported audio format"""
    audio_extensions = {'.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.wma'}
    return get_file_extension(filename) in audio_extensions


def bytes_to_readable(bytes_size: float) -> str:
    """Convert bytes to readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024:
            return f"{bytes_size:.2f} {unit}"
        bytes_size /= 1024
    return f"{bytes_size:.2f} TB"


def format_time(seconds: float) -> str:
    """Format seconds to HH:MM:SS"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


class APIResponse:
    """Helper class for API responses"""
    
    @staticmethod
    def success(data: dict, message: str = "Success", status_code: int = 200) -> tuple:
        """Create a success response"""
        response = {
            'success': True,
            'message': message,
            'data': data
        }
        return response, status_code
    
    @staticmethod
    def error(error_message: str, details: Optional[dict] = None, status_code: int = 400) -> tuple:
        """Create an error response"""
        response = {
            'success': False,
            'error': error_message,
            'details': details or {}
        }
        return response, status_code
    
    @staticmethod
    def processing(message: str, progress: int = 0) -> dict:
        """Create a processing response"""
        return {
            'success': True,
            'status': 'processing',
            'message': message,
            'progress': progress
        }


# Initialize directories on module import
try:
    setup_directories()
except Exception as e:
    logger.warning(f"Could not initialize directories: {str(e)}")
