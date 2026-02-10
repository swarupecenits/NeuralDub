"""
Test script to check translation service initialization
"""

import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

print("=" * 60)
print("Testing Translation Service Initialization")
print("=" * 60)

# Test 1: Check imports
print("\n1. Testing imports...")
try:
    import torch
    print(f"   ✓ torch version: {torch.__version__}")
    print(f"   ✓ CUDA available: {torch.cuda.is_available()}")
except ImportError as e:
    print(f"   ✗ torch import failed: {e}")

try:
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    print(f"   ✓ transformers imported successfully")
except ImportError as e:
    print(f"   ✗ transformers import failed: {e}")

# Test 2: Try to initialize translation service
print("\n2. Testing Translation Service initialization...")
try:
    from services.translation_service import TranslationService
    print("   ✓ TranslationService class imported")
    
    print("\n3. Creating TranslationService instance...")
    hf_token = os.getenv('HF_TOKEN')
    if not hf_token:
        print("   ✗ HF_TOKEN not found in environment variables")
        exit(1)
    
    service = TranslationService(
        model_size='200M', 
        device='cpu',
        hf_token=hf_token
    )
    print("   ✓ TranslationService initialized successfully!")
    
    print("\n4. Testing translation...")
    result = service.translate("Hello", "en", "hi")
    print(f"   ✓ Translation test successful!")
    print(f"   Original: {result.get('original_text')}")
    print(f"   Translated: {result.get('translated_text')}")
    
except Exception as e:
    print(f"   ✗ Failed: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Test completed")
print("=" * 60)
