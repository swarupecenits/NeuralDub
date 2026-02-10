"""
Translation Routes
Handles text translation endpoints
"""

from flask import Blueprint, request, jsonify, current_app
import logging
from services.translation_service import TranslationService

logger = logging.getLogger(__name__)
translation_bp = Blueprint('translation', __name__, url_prefix='/api')

# Global translation service instance
translation_service = None


def init_translation_service(app):
    """Initialize Translation service with app config"""
    global translation_service
    try:
        config = app.config
        logger.info("Initializing Translation Service...")
        translation_service = TranslationService(
            model_size=config.get('TRANSLATION_MODEL_SIZE', '200M'),
            device=config.get('TRANSLATION_DEVICE', 'cpu'),  # Changed to cpu as fallback
            hf_token=config.get('HF_TOKEN', None)
        )
        logger.info("Translation Service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Translation Service: {str(e)}")
        raise


@translation_bp.route('/translate', methods=['POST'])
def translate():
    """
    Translate text from source to target language
    
    Request:
        {
            'text': str,
            'source_lang': str,
            'target_lang': str
        }
    
    Returns:
        {
            'original_text': str,
            'translated_text': str,
            'source_lang': str,
            'target_lang': str,
            'confidence': float,
            'processing_time': float,
            'success': bool
        }
    """
    try:
        # Check if service is initialized
        if translation_service is None:
            logger.error("Translation service is not initialized")
            return jsonify({
                'success': False,
                'error': 'Translation service not initialized. Please check backend logs.'
            }), 503
        
        data = request.get_json()
        
        if not data:
            logger.error("No JSON data provided in request")
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Log the received data for debugging
        logger.info(f"Received translation request: {data}")
        
        # Extract and validate inputs
        text = data.get('text', '').strip()
        source_lang = data.get('source_lang', '')
        target_lang = data.get('target_lang', '')
        
        logger.info(f"Text: '{text}', Source: '{source_lang}', Target: '{target_lang}'")
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Text cannot be empty'
            }), 400
        
        if not source_lang or not target_lang:
            return jsonify({
                'success': False,
                'error': 'Source and target languages must be specified'
            }), 400
        
        # Translate
        result = translation_service.translate(text, source_lang, target_lang)
        
        if result.get('success'):
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Translation failed: {str(e)}"
        }), 500


@translation_bp.route('/translate/batch', methods=['POST'])
def translate_batch():
    """
    Translate multiple texts in batch
    
    Request:
        {
            'texts': [str],
            'source_lang': str,
            'target_lang': str
        }
    
    Returns:
        {
            'results': [translation_results],
            'total_count': int,
            'success_count': int,
            'processing_time': float,
            'success': bool
        }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Extract and validate inputs
        texts = data.get('texts', [])
        source_lang = data.get('source_lang', '')
        target_lang = data.get('target_lang', '')
        
        if not isinstance(texts, list) or not texts:
            return jsonify({
                'success': False,
                'error': 'Texts must be a non-empty list'
            }), 400
        
        if not source_lang or not target_lang:
            return jsonify({
                'success': False,
                'error': 'Source and target languages must be specified'
            }), 400
        
        # Translate batch
        results = translation_service.translate_batch(texts, source_lang, target_lang)
        
        # Count successful translations
        success_count = sum(1 for r in results if r.get('success', False))
        
        # Calculate total processing time
        total_processing_time = sum(r.get('processing_time', 0) for r in results)
        
        return jsonify({
            'results': results,
            'total_count': len(texts),
            'success_count': success_count,
            'processing_time': total_processing_time,
            'success': success_count == len(texts)
        }), 200
    
    except Exception as e:
        logger.error(f"Batch translation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Batch translation failed: {str(e)}"
        }), 500


@translation_bp.route('/translate/languages', methods=['GET'])
def get_languages():
    """
    Get all supported languages
    
    Returns:
        {
            'languages': {code: flores_code, ...},
            'supported_pairs_count': int
        }
    """
    try:
        languages = translation_service.get_supported_languages()
        pairs = translation_service.get_supported_language_pairs()
        
        return jsonify({
            'languages': languages,
            'supported_pairs_count': len(pairs),
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Language list error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@translation_bp.route('/translate/language-pairs', methods=['GET'])
def get_language_pairs():
    """
    Get all supported language pairs
    
    Returns:
        {
            'pairs': [
                {'source': code, 'target': code, 'source_name': flores_code, 'target_name': flores_code},
                ...
            ],
            'total_pairs': int
        }
    """
    try:
        pairs = translation_service.get_supported_language_pairs()
        
        return jsonify({
            'pairs': pairs,
            'total_pairs': len(pairs),
            'success': True
        }), 200
    
    except Exception as e:
        logger.error(f"Language pairs error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@translation_bp.route('/health', methods=['GET'])
def health():
    """Health check for translation service"""
    return jsonify({
        'status': 'healthy',
        'service': 'translation',
        'model_size': current_app.config.get('TRANSLATION_MODEL_SIZE'),
        'device': current_app.config.get('TRANSLATION_DEVICE')
    }), 200
