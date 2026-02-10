"""
Translation Service using IndicTrans2
Handles text translation between Indic languages
"""

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from typing import Dict, List, Optional, Tuple
import time
import logging
import torch

logger = logging.getLogger(__name__)


class TranslationService:
    """Service for IndicTrans2-based translation"""
    
    # Language code mappings for IndicTrans2 (Flores-200 codes)
    INDIC_LANGUAGE_CODES = {
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
        'brx': 'brx_Deva',
        'doi': 'doi_Deva',
        'gom': 'gom_Deva',
        'kas': 'kas_Arab',
        'mai': 'mai_Deva',
        'mni': 'mni_Mtei',
        'npi': 'npi_Deva',
        'san': 'san_Deva',
        'sat': 'sat_Olck',
        'snd': 'snd_Arab',
    }
    
    def __init__(self, model_size: str = '200M', device: str = None, hf_token: str = None):
        """
        Initialize Translation service
        
        Args:
            model_size: Model size (200M, 320M, or 1B)
            device: Device to run model on (cuda or cpu), auto-detected if None
            hf_token: Hugging Face access token for model downloads
        """
        self.model_size = model_size
        self.device = device if device else ('cuda' if torch.cuda.is_available() else 'cpu')
        self.hf_token = hf_token
        self.tokenizer_en2indic = None
        self.model_en2indic = None
        self.tokenizer_indic2en = None
        self.model_indic2en = None
        self._load_models()
    
    def _load_models(self):
        """Load translation models"""
        try:
            logger.info(f"Loading IndicTrans2 models ({self.model_size}) on {self.device}")
            
            # Determine model names based on size
            if self.model_size == '1B':
                en2indic_model = 'ai4bharat/indictrans2-en-indic-1B'
                indic2en_model = 'ai4bharat/indictrans2-indic-en-1B'
            elif self.model_size == '320M':
                en2indic_model = 'ai4bharat/indictrans2-en-indic-dist-320M'
                indic2en_model = 'ai4bharat/indictrans2-indic-en-dist-320M'
            else:  # 200M
                en2indic_model = 'ai4bharat/indictrans2-en-indic-dist-200M'
                indic2en_model = 'ai4bharat/indictrans2-indic-en-dist-200M'
            
            # Load English to Indic model
            logger.info(f"Loading {en2indic_model}...")
            self.tokenizer_en2indic = AutoTokenizer.from_pretrained(
                en2indic_model, 
                trust_remote_code=True,
                token=self.hf_token
            )
            self.model_en2indic = AutoModelForSeq2SeqLM.from_pretrained(
                en2indic_model,
                trust_remote_code=True,
                token=self.hf_token
            ).to(self.device)
            
            # Load Indic to English model
            logger.info(f"Loading {indic2en_model}...")
            self.tokenizer_indic2en = AutoTokenizer.from_pretrained(
                indic2en_model,
                trust_remote_code=True,
                token=self.hf_token
            )
            self.model_indic2en = AutoModelForSeq2SeqLM.from_pretrained(
                indic2en_model,
                trust_remote_code=True,
                token=self.hf_token
            ).to(self.device)
            
            logger.info("IndicTrans2 models loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load translation models: {str(e)}")
            raise
    
    def translate(self, text: str, source_lang: str, target_lang: str) -> Dict:
        """
        Translate text from source to target language
        
        Args:
            text: Text to translate
            source_lang: Source language code (e.g., 'en', 'hi')
            target_lang: Target language code (e.g., 'hi', 'en')
        
        Returns:
            Dictionary with translation results:
            - original_text: Original input text
            - translated_text: Translated text
            - source_lang: Source language
            - target_lang: Target language
            - confidence: Translation confidence score
            - processing_time: Time taken for translation
            - success: Whether translation was successful
        """
        if not self.model_en2indic or not self.model_indic2en:
            return {
                'original_text': text,
                'translated_text': '',
                'source_lang': source_lang,
                'target_lang': target_lang,
                'confidence': 0,
                'processing_time': 0,
                'success': False,
                'error': 'Translation model not loaded'
            }
        
        start_time = time.time()
        
        try:
            # Validate request
            valid, error = self.validate_translation_request(text, source_lang, target_lang)
            if not valid:
                return {
                    'original_text': text,
                    'translated_text': '',
                    'source_lang': source_lang,
                    'target_lang': target_lang,
                    'confidence': 0,
                    'processing_time': time.time() - start_time,
                    'success': False,
                    'error': error
                }
            
            # Convert Flores codes to short codes if needed
            # If already short codes, they'll stay as-is
            if source_lang in self.INDIC_LANGUAGE_CODES.values():
                # It's a Flores code, convert to short code
                source_lang = [k for k, v in self.INDIC_LANGUAGE_CODES.items() if v == source_lang][0]
            if target_lang in self.INDIC_LANGUAGE_CODES.values():
                # It's a Flores code, convert to short code  
                target_lang = [k for k, v in self.INDIC_LANGUAGE_CODES.items() if v == target_lang][0]
            
            # Get Flores codes
            src_flores = self.INDIC_LANGUAGE_CODES.get(source_lang, source_lang)
            tgt_flores = self.INDIC_LANGUAGE_CODES.get(target_lang, target_lang)
            
            logger.info(f"Translating from {src_flores} to {tgt_flores}")
            
            # Determine direction and select model
            if source_lang == 'en':
                # English to Indic
                tokenizer = self.tokenizer_en2indic
                model = self.model_en2indic
            else:
                # Indic to English
                tokenizer = self.tokenizer_indic2en
                model = self.model_indic2en
            
            # IndicTrans2 expects language tags prepended to the input
            # Format: "{src_flores} {tgt_flores} {text}"
            preprocessed_text = f"{src_flores} {tgt_flores} {text}"
            batch = [preprocessed_text]
            
            # Tokenize
            inputs = tokenizer(
                batch,
                truncation=True,
                padding=True,
                max_length=256,
                return_tensors="pt"
            )
            
            # Move inputs to device
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Generate translation
            with torch.no_grad():
                generated_tokens = model.generate(
                    inputs=inputs['input_ids'],
                    attention_mask=inputs['attention_mask'],
                    max_length=256,
                    num_beams=5,
                    early_stopping=True,
                    use_cache=False  # Disable cache to avoid errors
                )
            
            # Decode the generated tokens
            decoded = tokenizer.batch_decode(
                generated_tokens,
                skip_special_tokens=True,
                clean_up_tokenization_spaces=True
            )
            
            translated_text = decoded[0] if decoded else ""
            
            # Estimate confidence
            confidence = self._estimate_confidence(text, translated_text)
            
            processing_time = time.time() - start_time
            
            return {
                'original_text': text,
                'translated_text': translated_text,
                'source_lang': source_lang,
                'target_lang': target_lang,
                'confidence': confidence,
                'processing_time': processing_time,
                'success': True,
                'char_count_original': len(text),
                'char_count_translated': len(translated_text)
            }
        
        except Exception as e:
            logger.error(f"Translation failed: {str(e)}")
            processing_time = time.time() - start_time
            return {
                'original_text': text,
                'translated_text': '',
                'source_lang': source_lang,
                'target_lang': target_lang,
                'confidence': 0,
                'processing_time': processing_time,
                'success': False,
                'error': str(e)
            }
    
    def translate_batch(
        self, 
        texts: List[str], 
        source_lang: str, 
        target_lang: str
    ) -> List[Dict]:
        """
        Translate multiple texts
        
        Args:
            texts: List of texts to translate
            source_lang: Source language code
            target_lang: Target language code
        
        Returns:
            List of translation results
        """
        results = []
        for text in texts:
            result = self.translate(text, source_lang, target_lang)
            results.append(result)
        return results
    
    @staticmethod
    def validate_translation_request(
        text: str, 
        source_lang: str, 
        target_lang: str
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate translation request
        
        Args:
            text: Text to validate
            source_lang: Source language code (short code like 'en' or Flores code like 'eng_Latn')
            target_lang: Target language code (short code like 'hi' or Flores code like 'hin_Deva')
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check if text is empty
        if not text or not text.strip():
            return False, "Text cannot be empty"
        
        # Check if languages are the same
        if source_lang == target_lang:
            return False, "Source and target languages must be different"
        
        # Check if languages are supported
        # Accept both short codes ('en', 'hi') and Flores codes ('eng_Latn', 'hin_Deva')
        supported_short_codes = list(TranslationService.INDIC_LANGUAGE_CODES.keys())
        supported_flores_codes = list(TranslationService.INDIC_LANGUAGE_CODES.values())
        
        if source_lang not in supported_short_codes and source_lang not in supported_flores_codes:
            return False, f"Source language '{source_lang}' not supported"
        if target_lang not in supported_short_codes and target_lang not in supported_flores_codes:
            return False, f"Target language '{target_lang}' not supported"
        
        return True, None
    
    @staticmethod
    def _estimate_confidence(original: str, translated: str) -> float:
        """
        Estimate confidence score based on output characteristics
        
        Args:
            original: Original text
            translated: Translated text
        
        Returns:
            Confidence score between 0 and 1
        """
        # Base confidence
        confidence = 0.85
        
        # Reduce if translation is very short (likely error)
        if len(translated.split()) < max(1, len(original.split()) * 0.3):
            confidence -= 0.2
        
        # Reduce if translation is extremely long
        if len(translated) > len(original) * 3:
            confidence -= 0.1
        
        # Ensure between 0 and 1
        return max(0.0, min(1.0, confidence))
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Get all supported language pairs"""
        return self.INDIC_LANGUAGE_CODES.copy()
    
    def get_supported_language_pairs(self) -> List[Dict[str, str]]:
        """
        Get all possible language pairs
        
        Returns:
            List of language pair dictionaries
        """
        langs = list(self.INDIC_LANGUAGE_CODES.keys())
        pairs = []
        
        for src in langs:
            for tgt in langs:
                if src != tgt:
                    pairs.append({
                        'source': src,
                        'target': tgt,
                        'source_name': self.INDIC_LANGUAGE_CODES[src],
                        'target_name': self.INDIC_LANGUAGE_CODES[tgt]
                    })
        
        return pairs
