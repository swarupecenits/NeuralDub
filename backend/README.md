# NeuralDub Backend - Complete Setup & Run Guide

Complete backend implementation for NeuralDub featuring Whisper ASR and IndicTrans2 integration.

## 📋 Quick Overview

```
Audio Input (MP3, WAV, OGG, etc.)
        ↓
   Whisper ASR (Speech-to-Text)
        ↓
    Transcribed Text
        ↓
   IndicTrans2 (Translation)
        ↓
   Translated Text + Metrics
```

## ✅ Prerequisites

- **Python**: 3.9 or higher
- **GPU** (optional but recommended): NVIDIA GPU with CUDA support
- **RAM**: 8GB minimum (16GB+ recommended for smooth operation)
- **Disk Space**: 5-10GB for model downloads

## 🚀 Installation

### Step 1: Create Virtual Environment

**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**For GPU Support (NVIDIA CUDA):**
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

**For CPU Only:**
```bash
pip install torch torchvision torchaudio
```

### Step 3: Setup Environment Variables

```bash
# Copy example configuration
cp .env.example .env

# Edit .env and customize settings (optional)
# nano .env  # or use your editor
```

**Key Environment Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | development | Set to 'production' for deployment |
| `FLASK_DEBUG` | True | Disable debug in production |
| `API_PORT` | 5000 | Port to run the backend on |
| `WHISPER_MODEL` | base | Whisper model size (tiny, base, small, medium, large) |
| `WHISPER_DEVICE` | cuda | Device (cuda or cpu) |
| `TRANSLATION_MODEL_SIZE` | 200M | Translation model (200M, 320M, 1B) |
| `TRANSLATION_DEVICE` | cuda | Device (cuda or cpu) |

## 🧪 Verification

Before running, verify everything is set up correctly:

```bash
python setup.py
```

This checks:
- ✓ Python version
- ✓ All dependencies installed
- ✓ Environment file exists
- ✓ Required directories
- ✓ Model libraries available
- ✓ API can start

## 🏃 Running the Backend

### Development Mode (with auto-reload)

```bash
python app.py
```

Output should show:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

### Production Mode

```bash
FLASK_ENV=production gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

(Install gunicorn: `pip install gunicorn`)

## 📡 API Endpoints

### Speech Recognition

#### POST `/api/speech/transcribe`
Transcribe audio file to text

**Request:**
```bash
curl -X POST http://localhost:5000/api/speech/transcribe \
  -F "audio=@test.wav" \
  -F "language=en"
```

**Response:**
```json
{
  "text": "Hello, how are you today?",
  "language": "en",
  "segments": [...],
  "confidence": 0.95,
  "duration": 5.2,
  "processing_time": 2.3,
  "success": true
}
```

#### POST `/api/speech/detect-language`
Detect language in audio file

**Request:**
```bash
curl -X POST http://localhost:5000/api/speech/detect-language \
  -F "audio=@test.wav"
```

**Response:**
```json
{
  "language": "en",
  "success": true
}
```

### Translation

#### POST `/api/translate`
Translate text from source to target language

**Request:**
```bash
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello",
    "source_lang": "en",
    "target_lang": "hi"
  }'
```

**Response:**
```json
{
  "original_text": "Hello",
  "translated_text": "नमस्ते",
  "source_lang": "en",
  "target_lang": "hi",
  "confidence": 0.85,
  "processing_time": 1.2,
  "success": true
}
```

#### POST `/api/translate/batch`
Translate multiple texts in one request

**Request:**
```bash
curl -X POST http://localhost:5000/api/translate/batch \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["Hello", "Good morning"],
    "source_lang": "en",
    "target_lang": "hi"
  }'
```

**Response:**
```json
{
  "results": [...],
  "total_count": 2,
  "success_count": 2,
  "processing_time": 2.5,
  "success": true
}
```

#### GET `/api/translate/languages`
Get all supported languages

```bash
curl http://localhost:5000/api/translate/languages
```

#### GET `/api/translate/language-pairs`
Get all supported language pairs

```bash
curl http://localhost:5000/api/translate/language-pairs
```

### Health Checks

#### GET `/api/health`
Overall API health

```bash
curl http://localhost:5000/api/health
```

#### GET `/api/speech/health`
Speech service health

```bash
curl http://localhost:5000/api/speech/health
```

## 🧪 Testing with Sample Data

### Test Audio Transcription

**Create test audio (if you have espeak):**
```bash
espeak -w test.wav "Hello, how are you?"
```

**Transcribe it:**
```bash
curl -X POST http://localhost:5000/api/speech/transcribe \
  -F "audio=@test.wav"
```

### Test Translation

```bash
# English to Hindi
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","source_lang":"en","target_lang":"hi"}'

# Hindi to Tamil
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"नमस्ते","source_lang":"hi","target_lang":"ta"}'
```

## 📁 Project Structure

```
backend/
├── app.py                      # Main Flask application
├── config.py                   # Configuration management
├── setup.py                    # Setup verification script
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
│
├── services/
│   ├── __init__.py
│   ├── whisper_service.py      # Whisper ASR service
│   └── translation_service.py  # IndicTrans2 service
│
├── routes/
│   ├── __init__.py
│   ├── speech.py               # Speech recognition endpoints
│   └── translation.py          # Translation endpoints
│
├── models/
│   └── __init__.py
│
├── logs/                       # Application logs (auto-created)
├── temp/                       # Temporary uploaded files (auto-created)
│
└── BACKEND_IMPLEMENTATION_GUIDE.md
```

## 🔧 Configuration

### Model Selection

**Whisper Models (larger = better quality, slower):**
- `tiny` - 39M - Fastest, lower quality (dev only)
- `base` - 74M - Good balance ✓ RECOMMENDED
- `small` - 244M - Better quality
- `medium` - 769M - High quality
- `large` - 1.5B - Best quality, slowest

**Translation Models (larger = better quality, slower):**
- `200M` - Distilled, fastest ✓ RECOMMENDED
- `320M` - Balanced
- `1B` - Best quality, slowest

**Performance Comparison:**

| Config | Transcribe | Translate | Total |
|--------|-----------|-----------|-------|
| Tiny + 200M (CPU) | 30s | 10s | 40s |
| Base + 200M (GPU) | 2s | 1s | 3s |
| Medium + 1B (GPU) | 8s | 5s | 13s |

## 📊 Monitoring & Logging

### View Logs

```bash
# Real-time logs
tail -f logs/app.log

# On Windows PowerShell
Get-Content logs/app.log -Wait
```

### Performance Monitoring

The API includes timing information in all responses under `processing_time`.

## 🐛 Troubleshooting

### Issue: "CUDA out of memory"
**Solution:** Use smaller models or CPU
```bash
# Edit .env
WHISPER_DEVICE=cpu
TRANSLATION_DEVICE=cpu
```

### Issue: Models not downloading
**Solution:** Manually download
```python
import whisper
model = whisper.load_model("base")  # Downloads automatically
```

### Issue: "ModuleNotFoundError"
**Solution:** Reinstall dependencies
```bash
pip install --force-reinstall -r requirements.txt
```

### Issue: Port already in use
**Solution:** Change the port in .env
```bash
API_PORT=5001
```

### Issue: CORS errors from frontend
**Solution:** Update CORS_ORIGINS in .env
```bash
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📈 Performance Optimization

### For Production

1. **Use Gunicorn with multiple workers:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. **Use medium/smaller Whisper model:**
```bash
WHISPER_MODEL=base
TRANSLATION_MODEL_SIZE=200M
```

3. **Enable GPU caching:**
```bash
CACHE_ENABLED=true
CACHE_MAX_SIZE=100
```

4. **Use production grade WSGI server:**
```bash
pip install waitress
waitress-serve --port=5000 app:app
```

### For Development

Keep `FLASK_DEBUG=True` for auto-reload and detailed error messages.

## 🚢 Deployment

### Docker (Recommended)

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV FLASK_ENV=production
CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t neuraldub-backend .
docker run -p 5000:5000 neuraldub-backend
```

### Environment Variables for Deployment

```bash
export FLASK_ENV=production
export FLASK_DEBUG=False
export API_HOST=0.0.0.0
export WHISPER_DEVICE=cuda
export TRANSLATION_DEVICE=cuda
export CORS_ORIGINS=https://yourdomain.com
```

## 📚 Additional Resources

- [Whisper Documentation](https://github.com/openai/whisper)
- [IndicTrans2 Repository](https://github.com/AI4Bharat/IndicTrans2)
- [Flask Documentation](https://flask.palletsprojects.com/)

## 📝 Notes

- First request may be slow due to model loading
- Subsequent requests will be faster (models stay in memory)
- Supported languages: English and 22 Indic languages (Hindi, Bengali, Tamil, Telugu, etc.)
- Maximum file size: 25MB
- Maximum audio duration: 1 hour

## 🤝 Support

For issues or questions:
1. Check logs in `logs/app.log`
2. Run `python setup.py` to verify setup
3. Check the BACKEND_IMPLEMENTATION_GUIDE.md for detailed information
4. Review API response errors for specific issues

---

**Backend Version**: 1.0.0  
**Last Updated**: January 2025
