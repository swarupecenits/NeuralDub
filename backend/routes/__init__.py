"""
Routes package initialization
"""

from .speech import speech_bp, init_whisper_service
from .translation import translation_bp, init_translation_service
from .lip_sync import lip_sync_bp, init_lip_sync_service

__all__ = [
    'speech_bp', 
    'translation_bp', 
    'lip_sync_bp',
    'init_whisper_service', 
    'init_translation_service',
    'init_lip_sync_service'
]
