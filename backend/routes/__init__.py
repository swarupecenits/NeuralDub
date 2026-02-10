"""
Routes package initialization
"""

from .speech import speech_bp, init_whisper_service
from .translation import translation_bp, init_translation_service

__all__ = ['speech_bp', 'translation_bp', 'init_whisper_service', 'init_translation_service']
