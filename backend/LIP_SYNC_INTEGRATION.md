# Lip Sync Backend Integration - Complete Guide

## Overview

This document explains the complete backend integration of MuseTalk lip-syncing functionality into the NeuralDub platform.

## Architecture

### Components Created

1. **Lip Sync Service** (`backend/services/lip_sync_service.py`)
   - Core service wrapping MuseTalk functionality
   - Handles model loading, video preprocessing, and lip sync generation
   - Provides validation and cleanup utilities

2. **Lip Sync Routes** (`backend/routes/lip_sync.py`)
   - REST API endpoints for lip sync operations
   - Job tracking and status management
   - File upload/download handling

3. **Configuration** (`backend/config.py`)
   - MuseTalk path configuration
   - Model directory settings
   - Device settings (CPU/CUDA)
   - File size limits

4. **Utilities** (`backend/utils.py`)
   - Video file validation
   - Temp file management
   - Cleanup functions

## API Endpoints

### 1. Health Check
```
GET /api/lip-sync/health
```

**Response:**
```json
{
  "status": "ready",
  "models_loaded": true,
  "device": "cuda",
  "error": null
}
```

### 2. Generate Lip Sync
```
POST /api/lip-sync/generate
```

**Request (multipart/form-data):**
- `video`: Video file (mp4, avi, mov, mkv, webm)
- `audio`: Audio file (mp3, wav, m4a, aac, ogg)
- `bbox_shift`: (optional) Bounding box shift parameter (default: 0)

**Response:**
```json
{
  "success": true,
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Lip sync completed successfully",
  "output_path": "temp/outputs/550e8400.../lip_sync_550e8400....mp4"
}
```

### 3. Get Job Status
```
GET /api/lip-sync/status/<job_id>
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "created_at": "2026-02-10T12:00:00",
  "completed_at": "2026-02-10T12:05:00",
  "output_path": "temp/outputs/550e8400.../lip_sync_550e8400....mp4"
}
```

### 4. Download Result
```
GET /api/lip-sync/download/<job_id>
```

Downloads the generated lip-synced video file.

### 5. Cleanup Job
```
DELETE /api/lip-sync/cleanup/<job_id>
```

Removes temporary files for a completed job.

### 6. List All Jobs
```
GET /api/lip-sync/jobs
```

**Response:**
```json
{
  "total": 2,
  "jobs": [
    {
      "job_id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "completed",
      "created_at": "2026-02-10T12:00:00",
      "completed_at": "2026-02-10T12:05:00"
    }
  ]
}
```

## Configuration

### Environment Variables

Add to `backend/.env`:

```env
# Lip Sync Settings
MUSETALK_PATH=C:\Users\swaru\Documents\FYP Project\Project Codework\Lip Syncing\MuseTalk
MUSETALK_MODELS_DIR=C:\Users\swaru\Documents\FYP Project\Project Codework\Lip Syncing\MuseTalk\models
LIP_SYNC_DEVICE=cuda
LIP_SYNC_BBOX_SHIFT=0
```

### File Size Limits

- **Video**: 500 MB maximum
- **Audio**: 100 MB maximum

### Supported Formats

**Video:**
- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- MKV (.mkv)
- WebM (.webm)

**Audio:**
- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- AAC (.aac)
- OGG (.ogg)

## Dependencies

The following packages were added to `requirements.txt`:

```
# Video Processing & Lip Sync
opencv-python==4.9.0.80
moviepy==1.0.3
imageio[ffmpeg]>=2.31.0
ffmpeg-python==0.2.0

# MuseTalk Dependencies
diffusers==0.30.2
accelerate==0.28.0
einops==0.8.1
omegaconf==2.3.0
```

## Installation

1. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Ensure MuseTalk is setup:**
   - MuseTalk models should be downloaded
   - Path should be configured in `.env`

3. **Test the service:**
```bash
python -c "from services.lip_sync_service import get_lip_sync_service; print('OK')"
```

## Usage Example

### Python/Requests

```python
import requests

# Upload video and audio for lip sync
files = {
    'video': open('input_video.mp4', 'rb'),
    'audio': open('translated_audio.mp3', 'rb')
}

response = requests.post(
    'http://localhost:5000/api/lip-sync/generate',
    files=files
)

result = response.json()
job_id = result['job_id']

# Check status
status = requests.get(f'http://localhost:5000/api/lip-sync/status/{job_id}').json()
print(f"Status: {status['status']}")

# Download result
if status['status'] == 'completed':
    video = requests.get(f'http://localhost:5000/api/lip-sync/download/{job_id}')
    with open('output.mp4', 'wb') as f:
        f.write(video.content)
```

### cURL

```bash
# Generate lip sync
curl -X POST http://localhost:5000/api/lip-sync/generate \
  -F "video=@input_video.mp4" \
  -F "audio=@translated_audio.mp3"

# Check status
curl http://localhost:5000/api/lip-sync/status/<job_id>

# Download result
curl -o output.mp4 http://localhost:5000/api/lip-sync/download/<job_id>
```

## Integration with NeuralDub Workflow

### Complete Speech-to-Speech Translation Pipeline

```
1. Upload Audio → Whisper Transcription
   POST /api/speech/transcribe
   
2. Translate Text → IndicTrans2 Translation
   POST /api/translate
   
3. Text-to-Speech → External TTS (to be integrated)
   (Generate audio in target language)
   
4. Lip Sync Video → MuseTalk Integration
   POST /api/lip-sync/generate
   
5. Download Final Video
   GET /api/lip-sync/download/<job_id>
```

## Error Handling

### Common Errors

**503 Service Unavailable:**
```json
{
  "error": "Lip sync service not available",
  "details": "Models not loaded: ..."
}
```

**400 Bad Request:**
```json
{
  "error": "Invalid video format. Supported: .mp4, .avi, .mov, .mkv, .webm"
}
```

**413 Payload Too Large:**
```json
{
  "error": "File too large",
  "message": "The uploaded file exceeds the maximum allowed size"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error during lip sync generation: ...",
  "traceback": "..." // Only in development mode
}
```

## Performance Considerations

### GPU vs CPU

- **GPU (CUDA)**: Recommended for production
  - Faster processing (~30fps on NVIDIA V100)
  - Better quality with larger models
  
- **CPU**: Development/Testing
  - Slower processing (5-10x slower)
  - Lower memory requirements

### Processing Time

Approximate processing times:
- Short video (10s): 30-60 seconds on GPU
- Medium video (30s): 1-3 minutes on GPU
- Long video (2min): 5-10 minutes on GPU

### Memory Requirements

- **GPU VRAM**: 4GB minimum (8GB+ recommended)
- **System RAM**: 8GB minimum (16GB+ recommended)
- **Disk Space**: 20GB for models + temp storage

## Troubleshooting

### Models Not Loading

**Issue:** Service returns "models not loaded" error

**Solutions:**
1. Check MuseTalk path in `.env`
2. Verify models are downloaded
3. Check Python path can find MuseTalk modules
4. Review backend logs for detailed error

### CUDA Out of Memory

**Issue:** GPU memory errors during processing

**Solutions:**
1. Process shorter videos
2. Switch to CPU mode (slower)
3. Close other GPU-using applications
4. Upgrade GPU if possible

### Video Processing Fails

**Issue:** Error during video preprocessing

**Solutions:**
1. Check video format is supported
2. Ensure face is clearly visible
3. Try different `bbox_shift` values
4. Verify video codec compatibility

## Maintenance

### Cleanup Temporary Files

```python
# Manual cleanup
curl -X DELETE http://localhost:5000/api/lip-sync/cleanup/<job_id>

# Or programmatically in Python
import shutil
shutil.rmtree('temp/uploads')
shutil.rmtree('temp/outputs')
```

### Monitor Active Jobs

```bash
# List all jobs
curl http://localhost:5000/api/lip-sync/jobs

# Check specific job
curl http://localhost:5000/api/lip-sync/status/<job_id>
```

## Next Steps

1. **Frontend Integration:**
   - Create video upload component
   - Add lip sync processing UI
   - Implement progress tracking
   - Video preview and download

2. **Optimization:**
   - Add job queue (Celery/Redis)
   - Implement batch processing
   - Add caching for repeated requests
   - Optimize model loading

3. **Features:**
   - Support for multiple speakers
   - Custom avatar selection
   - Real-time preview
   - Background processing

4. **Monitoring:**
   - Add metrics collection
   - Performance monitoring
   - Error tracking
   - Usage analytics

## Testing

### Unit Tests

```python
# Test service initialization
from services.lip_sync_service import LipSyncService

service = LipSyncService(
    musetalk_path='path/to/musetalk',
    models_dir='path/to/models',
    device='cpu'
)

assert service.check_models() == True

# Test validation
is_valid, error = service.validate_inputs(
    'test_video.mp4',
    'test_audio.mp3'
)
assert is_valid == True
```

### Integration Tests

```bash
# Run backend
python app.py

# Test health endpoint
curl http://localhost:5000/api/lip-sync/health

# Test generation with sample files
curl -X POST http://localhost:5000/api/lip-sync/generate \
  -F "video=@samples/test_video.mp4" \
  -F "audio=@samples/test_audio.mp3"
```

## Support

For issues or questions:
1. Check backend logs: `backend/logs/app.log`
2. Enable debug mode: Set `FLASK_ENV=development`
3. Review MuseTalk documentation
4. Check model compatibility

## License

This integration follows the same license as the parent NeuralDub project and respects MuseTalk's MIT license.
