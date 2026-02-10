"""
Configuration module for NeuralDub Backend
Handles environment variables and application settings
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration"""
    DEBUG = False
    TESTING = False
    
    # Flask settings
    JSON_SORT_KEYS = False
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024  # 25MB max file size
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # API settings
    API_PORT = int(os.getenv('API_PORT', 5000))
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    
    # Model settings
    WHISPER_MODEL = os.getenv('WHISPER_MODEL', 'base')  # tiny, base, small, medium, large
    WHISPER_DEVICE = os.getenv('WHISPER_DEVICE', 'cuda')  # cuda or cpu
    
    TRANSLATION_MODEL_SIZE = os.getenv('TRANSLATION_MODEL_SIZE', '200M')  # 200M, 320M, 1B
    TRANSLATION_DEVICE = os.getenv('TRANSLATION_DEVICE', 'cuda')  # cuda or cpu
    
    # Hugging Face settings
    HF_TOKEN = os.getenv('HF_TOKEN', None)  # Hugging Face access token
    
    # Cache settings
    CACHE_ENABLED = os.getenv('CACHE_ENABLED', 'true').lower() == 'true'
    CACHE_MAX_SIZE = int(os.getenv('CACHE_MAX_SIZE', 100))
    
    # Logging settings
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/app.log')
    
    # Audio processing settings
    AUDIO_SAMPLE_RATE = int(os.getenv('AUDIO_SAMPLE_RATE', 16000))
    MAX_AUDIO_DURATION = int(os.getenv('MAX_AUDIO_DURATION', 3600))  # 1 hour in seconds
    
    # Supported languages
    SUPPORTED_LANGUAGES = {
        'en': 'eng_Latn',
        'hi': 'hin_Deva',
        'bn': 'ben_Beng',
        'gu': 'guj_Gujr',
        'kn': 'kan_Knda',
        'ml': 'mal_Mlym',
        'mr': 'mar_Deva',
        'or': 'ory_Orya',
        'pa': 'pan_Guru',
        'ta': 'tam_Taml',
        'te': 'tel_Telu',
        'as': 'asm_Beng',
        'ur': 'urd_Arab',
    }


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    WHISPER_DEVICE = 'cpu'
    TRANSLATION_DEVICE = 'cpu'


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    WHISPER_DEVICE = 'cuda'
    TRANSLATION_DEVICE = 'cuda'


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    WHISPER_DEVICE = 'cpu'
    TRANSLATION_DEVICE = 'cpu'
    CACHE_ENABLED = False


# Select configuration based on environment
def get_config():
    """Get configuration based on FLASK_ENV"""
    env = os.getenv('FLASK_ENV', 'development')
    
    if env == 'production':
        return ProductionConfig()
    elif env == 'testing':
        return TestingConfig()
    else:
        return DevelopmentConfig()
