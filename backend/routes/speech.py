"""
Speech Recognition Routes
Handles audio transcription and language detection endpoints
"""

from flask import Blueprint, request, jsonify, current_app
import logging
import os
import tempfile
from werkzeug.utils import secure_filename
from services.whisper_service import WhisperService

logger = logging.getLogger(__name__)
speech_bp = Blueprint('speech', __name__, url_prefix='/api/speech')

# Global whisper service instance
whisper_service = None


def init_whisper_service(app):
    """Initialize Whisper service with app config"""
    global whisper_service
    config = app.config
    whisper_service = WhisperService(
        model_name=config.get('WHISPER_MODEL', 'base'),
        device=config.get('WHISPER_DEVICE', 'cuda')
    )


@speech_bp.route('/transcribe', methods=['POST'])
def transcribe():
    """
    Transcribe audio file to text
    
    Request:
        - audio: Audio file (wav, mp3, ogg, m4a, flac)
        - language: Optional language code (auto-detect if not provided)
    
    Returns:
        {
            'text': str,
            'language': str,
            'segments': list,
            'confidence': float,
            'duration': float,
            'processing_time': float,
            'success': bool
        }
    """
    try:
        # Log request info
        logger.info(f"Transcribe request - Files: {list(request.files.keys())}, Form: {dict(request.form)}")
        
        # Check if audio file is in request (accept both 'audio' and 'file')
        if 'audio' in request.files:
            audio_file = request.files['audio']
        elif 'file' in request.files:
            audio_file = request.files['file']
        else:
            logger.error("No audio file in request")
            return jsonify({
                'success': False,
                'error': 'No audio file provided. Expected field name: "audio" or "file"'
            }), 400
        
        language = request.form.get('language', None)
        
        logger.info(f"Processing file: {audio_file.filename}, Language: {language}")
        
        if audio_file.filename == '':
            logger.error("Empty filename")
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Validate audio file
        logger.info(f"Validating file: {audio_file.filename}")
        is_valid, error_msg = whisper_service.validate_audio_file(audio_file.filename)
        if not is_valid:
            logger.error(f"Validation failed: {error_msg}")
            return jsonify({
                'success': False,
                'error': error_msg
            }), 400
        
        logger.info(f"File validated successfully, saving temporarily...")
        
        # Save audio file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            audio_file.save(tmp_file.name)
            tmp_path = tmp_file.name
        
        try:
            # Transcribe audio
            result = whisper_service.transcribe(tmp_path, language)
            
            # Clean up temp file
            os.unlink(tmp_path)
            
            if result.get('success'):
                return jsonify(result), 200
            else:
                return jsonify(result), 500
        
        except Exception as e:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
            raise
    
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Transcription failed: {str(e)}"
        }), 500


@speech_bp.route('/detect-language', methods=['POST'])
def detect_language():
    """
    Detect language in audio file
    
    Request:
        - audio: Audio file (wav, mp3, ogg, m4a, flac)
    
    Returns:
        {
            'language': str (language code),
            'success': bool
        }
    """
    try:
        if 'audio' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No audio file provided'
            }), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Validate audio file
        is_valid, error_msg = whisper_service.validate_audio_file(audio_file.filename)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_msg
            }), 400
        
        # Save audio file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            audio_file.save(tmp_file.name)
            tmp_path = tmp_file.name
        
        try:
            # Detect language
            language = whisper_service.detect_language(tmp_path)
            
            # Clean up temp file
            os.unlink(tmp_path)
            
            return jsonify({
                'language': language,
                'success': True
            }), 200
        
        except Exception as e:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
            raise
    
    except Exception as e:
        logger.error(f"Language detection error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Language detection failed: {str(e)}"
        }), 500


@speech_bp.route('/health', methods=['GET'])
def health():
    """Health check for speech service"""
    return jsonify({
        'status': 'healthy',
        'service': 'speech',
        'model': current_app.config.get('WHISPER_MODEL'),
        'device': current_app.config.get('WHISPER_DEVICE')
    }), 200


@speech_bp.route('/models', methods=['GET'])
def get_models():
    """Get available Whisper models"""
    return jsonify({
        'available_models': ['tiny', 'base', 'small', 'medium', 'large'],
        'current_model': current_app.config.get('WHISPER_MODEL')
    }), 200
