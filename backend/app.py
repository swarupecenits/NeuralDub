"""
NeuralDub Backend - Main Flask Application
Handles audio transcription and translation using Whisper ASR and IndicTrans2
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import os
from datetime import datetime
from config import get_config
from routes import speech_bp, translation_bp, init_whisper_service, init_translation_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def create_app(config=None):
    """
    Application factory function
    
    Args:
        config: Configuration object (uses environment config if None)
    
    Returns:
        Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    if config is None:
        config = get_config()
    
    app.config.from_object(config)
    
    # Enable CORS
    CORS(
        app,
        origins=app.config.get('CORS_ORIGINS', ['http://localhost:5173']),
        methods=['GET', 'POST', 'OPTIONS'],
        allow_headers=['Content-Type', 'Authorization'],
        supports_credentials=True,
        max_age=3600
    )
    
    # Initialize services
    try:
        logger.info("Initializing Whisper service...")
        init_whisper_service(app)
        logger.info("Whisper service initialized")
    except Exception as e:
        logger.error(f"Failed to initialize Whisper service: {str(e)}")
        logger.exception(e)  # Print full traceback
        # Don't exit, allow graceful degradation
    
    try:
        logger.info("Initializing Translation service...")
        init_translation_service(app)
        logger.info("Translation service initialized")
    except Exception as e:
        logger.error(f"Failed to initialize Translation service: {str(e)}")
        logger.exception(e)  # Print full traceback
        # Don't exit, allow graceful degradation
    
    # Register blueprints
    app.register_blueprint(speech_bp)
    app.register_blueprint(translation_bp)
    
    # Root endpoint
    @app.route('/api', methods=['GET'])
    def api_root():
        """API root endpoint"""
        return jsonify({
            'service': 'NeuralDub Backend',
            'version': '1.0.0',
            'timestamp': datetime.utcnow().isoformat(),
            'endpoints': {
                'speech': {
                    'transcribe': 'POST /api/speech/transcribe',
                    'detect_language': 'POST /api/speech/detect-language',
                    'health': 'GET /api/speech/health'
                },
                'translation': {
                    'translate': 'POST /api/translate',
                    'batch_translate': 'POST /api/translate/batch',
                    'get_languages': 'GET /api/translate/languages',
                    'get_language_pairs': 'GET /api/translate/language-pairs',
                    'health': 'GET /api/health'
                }
            }
        }), 200
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Overall health check"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'services': {
                'speech': 'ok',
                'translation': 'ok'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors"""
        return jsonify({
            'success': False,
            'error': 'Endpoint not found',
            'status_code': 404
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        """Handle 405 errors"""
        return jsonify({
            'success': False,
            'error': 'Method not allowed',
            'status_code': 405
        }), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'status_code': 500
        }), 500
    
    @app.errorhandler(413)
    def request_entity_too_large(error):
        """Handle 413 errors (file too large)"""
        return jsonify({
            'success': False,
            'error': 'File too large. Maximum size is 25MB',
            'status_code': 413
        }), 413
    
    # Log startup
    logger.info("=" * 60)
    logger.info("NeuralDub Backend Started")
    logger.info("=" * 60)
    logger.info(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    logger.info(f"Debug Mode: {app.debug}")
    logger.info(f"Whisper Model: {app.config.get('WHISPER_MODEL')}")
    logger.info(f"Whisper Device: {app.config.get('WHISPER_DEVICE')}")
    logger.info(f"Translation Model Size: {app.config.get('TRANSLATION_MODEL_SIZE')}")
    logger.info(f"Translation Device: {app.config.get('TRANSLATION_DEVICE')}")
    logger.info(f"CORS Origins: {app.config.get('CORS_ORIGINS')}")
    logger.info("=" * 60)
    
    return app


# Create app instance for direct execution
app = create_app()


if __name__ == '__main__':
    # Get configuration
    config = get_config()
    
    # Run development server
    app.run(
        host=config.API_HOST,
        port=config.API_PORT,
        debug=config.DEBUG,
        threaded=True,
        use_reloader=False  # Disable reloader to avoid loading models twice
    )
