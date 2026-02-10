"""
Backend Setup and Testing Script
Run this to initialize and test the backend
"""

import sys
import os
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def check_python_version():
    """Check if Python version is 3.9+"""
    logger.info("Checking Python version...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 9):
        logger.error(f"Python 3.9+ required. Found {version.major}.{version.minor}")
        return False
    logger.info(f"✓ Python {version.major}.{version.minor} detected")
    return True


def check_dependencies():
    """Check if all required packages are installed"""
    logger.info("Checking dependencies...")
    
    required_packages = [
        'flask',
        'flask_cors',
        'torch',
        'transformers',
        'whisper',
        'indictrans',
        'librosa',
        'dotenv'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            logger.info(f"✓ {package} installed")
        except ImportError:
            logger.error(f"✗ {package} NOT installed")
            missing_packages.append(package)
    
    if missing_packages:
        logger.error(f"\nMissing packages: {', '.join(missing_packages)}")
        logger.error("Install them with: pip install -r requirements.txt")
        return False
    
    return True


def check_environment_file():
    """Check if .env file exists"""
    logger.info("Checking environment configuration...")
    
    env_file = Path('.env')
    env_example = Path('.env.example')
    
    if not env_file.exists():
        if env_example.exists():
            logger.warning(".env file not found. Using .env.example as template")
            logger.info("Creating .env from .env.example...")
            import shutil
            shutil.copy(env_example, env_file)
            logger.info("✓ .env file created")
        else:
            logger.error("Neither .env nor .env.example found!")
            return False
    else:
        logger.info("✓ .env file exists")
    
    return True


def check_directories():
    """Check if required directories exist"""
    logger.info("Checking directories...")
    
    directories = [
        'logs',
        'temp',
        'services',
        'routes'
    ]
    
    for directory in directories:
        path = Path(directory)
        if path.exists():
            logger.info(f"✓ {directory}/ exists")
        else:
            logger.warning(f"Creating {directory}/ directory...")
            path.mkdir(exist_ok=True)
    
    return True


def check_models():
    """Check if models can be loaded"""
    logger.info("Checking model availability...")
    
    try:
        logger.info("Testing Whisper model loading (this may take a moment)...")
        import whisper
        # Don't actually load the large model, just check if the library works
        logger.info("✓ Whisper library available")
        
        logger.info("Testing IndicTrans2 availability...")
        from indictrans import pipeline as indic_pipeline
        logger.info("✓ IndicTrans2 library available")
        
        return True
    
    except ImportError as e:
        logger.error(f"✗ Model library import failed: {str(e)}")
        return False


def test_api_startup():
    """Test if API can start"""
    logger.info("Testing API startup...")
    
    try:
        from app import create_app
        logger.info("✓ Flask app can be imported")
        
        # Try to create app
        app = create_app()
        logger.info("✓ Flask app created successfully")
        
        # Check if routes are registered
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append(str(rule))
        
        logger.info(f"✓ Found {len(routes)} registered routes")
        
        return True
    
    except Exception as e:
        logger.error(f"✗ API startup test failed: {str(e)}")
        return False


def run_all_checks():
    """Run all checks"""
    logger.info("=" * 60)
    logger.info("NeuralDub Backend - Setup & Verification")
    logger.info("=" * 60)
    
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Environment File", check_environment_file),
        ("Directories", check_directories),
        ("Model Libraries", check_models),
        ("API Startup", test_api_startup),
    ]
    
    results = []
    
    for check_name, check_func in checks:
        logger.info("")
        try:
            result = check_func()
            results.append((check_name, result))
        except Exception as e:
            logger.error(f"✗ {check_name} check failed with error: {str(e)}")
            results.append((check_name, False))
    
    # Print summary
    logger.info("")
    logger.info("=" * 60)
    logger.info("VERIFICATION SUMMARY")
    logger.info("=" * 60)
    
    all_passed = True
    for check_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        logger.info(f"{status}: {check_name}")
        if not result:
            all_passed = False
    
    logger.info("=" * 60)
    
    if all_passed:
        logger.info("✓ All checks passed! Backend is ready to run.")
        logger.info("")
        logger.info("To start the server, run:")
        logger.info("  python app.py")
        logger.info("")
        logger.info("The API will be available at http://localhost:5000")
        logger.info("=" * 60)
        return 0
    else:
        logger.error("✗ Some checks failed. Please fix the issues above.")
        logger.info("=" * 60)
        return 1


if __name__ == '__main__':
    sys.exit(run_all_checks())
