"""
Lip Sync API Routes
Handles video lip-syncing requests
"""

from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
import logging
import os
import uuid
from datetime import datetime
import traceback
from services.lip_sync_service import get_lip_sync_service

logger = logging.getLogger(__name__)

# Blueprint
lip_sync_bp = Blueprint('lip_sync', __name__, url_prefix='/api/lip-sync')

# Service instance (will be initialized in init_lip_sync_service)
_lip_sync_service = None

# Job tracking
_active_jobs = {}


def init_lip_sync_service(app):
    """
    Initialize the lip sync service from Flask app config
    
    Args:
        app: Flask application instance
    """
    global _lip_sync_service
    
    try:
        musetalk_path = app.config.get('MUSETALK_PATH')
        models_dir = app.config.get('MUSETALK_MODELS_DIR')
        device = app.config.get('LIP_SYNC_DEVICE', 'cuda')
        
        logger.info(f"Initializing lip sync service...")
        logger.info(f"MuseTalk path: {musetalk_path}")
        logger.info(f"Models dir: {models_dir}")
        logger.info(f"Device: {device}")
        
        _lip_sync_service = get_lip_sync_service(
            musetalk_path=musetalk_path,
            models_dir=models_dir,
            device=device
        )
        
        logger.info("Lip sync service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize lip sync service: {e}")
        logger.exception(e)
        raise


def init_lip_sync_service(service):
    """
    Initialize the lip sync service
    
    Args:
        service: LipSyncService instance or Flask app
    """
    global _lip_sync_service
    
    # Check if it's a Flask app
    if hasattr(service, 'config'):
        app = service
        try:
            musetalk_path = app.config.get('MUSETALK_PATH')
            models_dir = app.config.get('MUSETALK_MODELS_DIR')
            device = app.config.get('LIP_SYNC_DEVICE', 'cuda')
            
            logger.info(f"Initializing lip sync service...")
            logger.info(f"MuseTalk path: {musetalk_path}")
            logger.info(f"Models dir: {models_dir}")
            logger.info(f"Device: {device}")
            
            _lip_sync_service = get_lip_sync_service(
                musetalk_path=musetalk_path,
                models_dir=models_dir,
                device=device
            )
            
            logger.info("Lip sync service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize lip sync service: {e}")
            logger.exception(e)
            raise
    else:
        # Direct service instance
        _lip_sync_service = service
        logger.info("Lip sync service initialized in routes")


@lip_sync_bp.route('/health', methods=['GET'])
def health_check():
    """Check if lip sync service is ready"""
    if _lip_sync_service is None:
        return jsonify({
            'status': 'error',
            'message': 'Lip sync service not initialized'
        }), 503
    
    models_loaded = _lip_sync_service.check_models()
    
    return jsonify({
        'status': 'ready' if models_loaded else 'degraded',
        'models_loaded': models_loaded,
        'device': _lip_sync_service.device,
        'error': _lip_sync_service.load_error if not models_loaded else None
    })


@lip_sync_bp.route('/generate', methods=['POST'])
def generate_lip_sync():
    """
    Generate lip-synced video
    
    Expected form data:
        - video: Video file (mp4, avi, mov, mkv, webm)
        - audio: Audio file (mp3, wav, m4a, aac, ogg)
        - bbox_shift: (optional) Bounding box shift parameter (default: 0)
    
    Returns:
        JSON with job_id for status tracking
    """
    try:
        logger.info("=" * 60)
        logger.info("Received lip sync generation request")
        logger.info(f"Request files: {list(request.files.keys())}")
        logger.info(f"Request form: {dict(request.form)}")
        
        # Check service
        if _lip_sync_service is None:
            logger.error("Lip sync service not initialized")
            return jsonify({
                'error': 'Lip sync service not available'
            }), 503
        
        if not _lip_sync_service.check_models():
            logger.error("Models not loaded")
            return jsonify({
                'error': 'Models not loaded',
                'details': _lip_sync_service.load_error
            }), 503
        
        # Get files
        if 'video' not in request.files:
            logger.error("No video file in request")
            return jsonify({'error': 'No video file provided'}), 400
        
        if 'audio' not in request.files:
            logger.error("No audio file in request")
            return jsonify({'error': 'No audio file provided'}), 400
        
        video_file = request.files['video']
        audio_file = request.files['audio']
        
        if video_file.filename == '':
            return jsonify({'error': 'No video file selected'}), 400
        
        if audio_file.filename == '':
            return jsonify({'error': 'No audio file selected'}), 400
        
        # Get optional parameters
        bbox_shift = int(request.form.get('bbox_shift', 0))
        
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Create temp directories
        upload_dir = os.path.join('temp', 'uploads', job_id)
        output_dir = os.path.join('temp', 'outputs', job_id)
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)
        
        # Save uploaded files
        video_filename = secure_filename(video_file.filename)
        audio_filename = secure_filename(audio_file.filename)
        
        video_path = os.path.join(upload_dir, video_filename)
        audio_path = os.path.join(upload_dir, audio_filename)
        
        video_file.save(video_path)
        audio_file.save(audio_path)
        
        logger.info(f"Saved video to: {video_path}")
        logger.info(f"Saved audio to: {audio_path}")
        
        # Validate inputs
        is_valid, error_msg = _lip_sync_service.validate_inputs(video_path, audio_path)
        if not is_valid:
            logger.error(f"Validation failed: {error_msg}")
            return jsonify({'error': error_msg}), 400
        
        # Initialize job status
        _active_jobs[job_id] = {
            'status': 'processing',
            'created_at': datetime.now().isoformat(),
            'video_path': video_path,
            'audio_path': audio_path,
            'output_dir': output_dir
        }
        
        # Generate output path
        output_filename = f"lip_sync_{job_id}.mp4"
        output_path = os.path.join(output_dir, output_filename)
        
        # Process asynchronously (in production, use celery or similar)
        # For now, process synchronously
        logger.info("Starting lip sync generation...")
        result = _lip_sync_service.generate_lip_sync(
            video_path=video_path,
            audio_path=audio_path,
            output_path=output_path,
            bbox_shift=bbox_shift
        )
        
        if result['success']:
            _active_jobs[job_id]['status'] = 'completed'
            _active_jobs[job_id]['output_path'] = result['output_path']
            _active_jobs[job_id]['completed_at'] = datetime.now().isoformat()
            
            logger.info(f"Lip sync completed successfully: {job_id}")
            
            return jsonify({
                'success': True,
                'job_id': job_id,
                'message': 'Lip sync completed successfully',
                'output_path': result['output_path']
            }), 200
        else:
            _active_jobs[job_id]['status'] = 'failed'
            _active_jobs[job_id]['error'] = result.get('error')
            
            logger.error(f"Lip sync failed: {result.get('error')}")
            
            return jsonify({
                'success': False,
                'job_id': job_id,
                'error': result.get('error')
            }), 500
    
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        
        return jsonify({
            'error': error_msg,
            'traceback': traceback.format_exc() if os.getenv('FLASK_ENV') == 'development' else None
        }), 500


@lip_sync_bp.route('/status/<job_id>', methods=['GET'])
def get_job_status(job_id):
    """
    Get the status of a lip sync job
    
    Args:
        job_id: Unique job identifier
        
    Returns:
        JSON with job status information
    """
    if job_id not in _active_jobs:
        return jsonify({
            'error': 'Job not found'
        }), 404
    
    job_info = _active_jobs[job_id]
    
    return jsonify({
        'job_id': job_id,
        'status': job_info['status'],
        'created_at': job_info['created_at'],
        'completed_at': job_info.get('completed_at'),
        'output_path': job_info.get('output_path'),
        'error': job_info.get('error')
    })


@lip_sync_bp.route('/download/<job_id>', methods=['GET'])
def download_result(job_id):
    """
    Download the generated lip-synced video
    
    Args:
        job_id: Unique job identifier
        
    Returns:
        Video file or error
    """
    if job_id not in _active_jobs:
        return jsonify({
            'error': 'Job not found'
        }), 404
    
    job_info = _active_jobs[job_id]
    
    if job_info['status'] != 'completed':
        return jsonify({
            'error': f"Job not completed. Current status: {job_info['status']}"
        }), 400
    
    output_path = job_info.get('output_path')
    
    if not output_path or not os.path.exists(output_path):
        return jsonify({
            'error': 'Output file not found'
        }), 404
    
    try:
        return send_file(
            output_path,
            mimetype='video/mp4',
            as_attachment=True,
            download_name=f"lip_sync_{job_id}.mp4"
        )
    except Exception as e:
        logger.error(f"Error sending file: {e}")
        return jsonify({
            'error': f'Error sending file: {str(e)}'
        }), 500


@lip_sync_bp.route('/cleanup/<job_id>', methods=['DELETE'])
def cleanup_job(job_id):
    """
    Clean up temporary files for a job
    
    Args:
        job_id: Unique job identifier
        
    Returns:
        JSON confirmation
    """
    if job_id not in _active_jobs:
        return jsonify({
            'error': 'Job not found'
        }), 404
    
    try:
        job_info = _active_jobs[job_id]
        
        # Clean up temp directories
        upload_dir = os.path.dirname(job_info.get('video_path', ''))
        output_dir = job_info.get('output_dir', '')
        
        import shutil
        if os.path.exists(upload_dir):
            shutil.rmtree(upload_dir)
        if os.path.exists(output_dir):
            shutil.rmtree(output_dir)
        
        # Remove from active jobs
        del _active_jobs[job_id]
        
        logger.info(f"Cleaned up job: {job_id}")
        
        return jsonify({
            'success': True,
            'message': f'Job {job_id} cleaned up successfully'
        })
    
    except Exception as e:
        logger.error(f"Error cleaning up job: {e}")
        return jsonify({
            'error': f'Cleanup failed: {str(e)}'
        }), 500


@lip_sync_bp.route('/jobs', methods=['GET'])
def list_jobs():
    """
    List all active jobs
    
    Returns:
        JSON with list of job statuses
    """
    jobs = []
    
    for job_id, job_info in _active_jobs.items():
        jobs.append({
            'job_id': job_id,
            'status': job_info['status'],
            'created_at': job_info['created_at'],
            'completed_at': job_info.get('completed_at')
        })
    
    return jsonify({
        'total': len(jobs),
        'jobs': jobs
    })


# Error handlers
@lip_sync_bp.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large errors"""
    return jsonify({
        'error': 'File too large',
        'message': 'The uploaded file exceeds the maximum allowed size'
    }), 413


@lip_sync_bp.errorhandler(500)
def internal_server_error(error):
    """Handle internal server errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({
        'error': 'Internal server error',
        'message': str(error)
    }), 500
