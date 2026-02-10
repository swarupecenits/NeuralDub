/**
 * IndicTrans2 Translation Service
 * Handles translation between Indic languages using IndicTrans2 model
 */

export interface TranslationRequest {
  text: string
  sourceLang: string
  targetLang: string
}

export interface TranslationResponse {
  translatedText: string
  sourceLang: string
  targetLang: string
  confidence: number
  processingTime: number
}

export interface TranslationMetrics {
  sourceLength: number
  targetLength: number
  sourceLang: string
  targetLang: string
  confidence: number
  processingTime: number
  wordsPerSecond: number
}

// Language code mappings for IndicTrans2
export const INDIC_LANGUAGE_CODES: { [key: string]: string } = {
  en: 'eng_Latn',
  hi: 'hin_Deva',
  bn: 'ben_Beng',
  gu: 'guj_Gujr',
  kn: 'kan_Knda',
  ml: 'mal_Mlym',
  mr: 'mar_Deva',
  or: 'ory_Orya',
  pa: 'pan_Guru',
  ta: 'tam_Taml',
  te: 'tel_Telu',
  as: 'asm_Beng',
  brx: 'brx_Deva',
  doi: 'doi_Deva',
  gom: 'gom_Deva',
  kas_arab: 'kas_Arab',
  kas_dev: 'kas_Deva',
  mai: 'mai_Deva',
  mni_beng: 'mni_Beng',
  mni_mtei: 'mni_Mtei',
  ne: 'npi_Deva',
  sa: 'san_Deva',
  sat: 'sat_Olck',
  snd_arab: 'snd_Arab',
  snd_dev: 'snd_Deva',
  ur: 'urd_Arab',
}

/**
 * Translate text from source language to target language
 */
export async function translateText(
  request: TranslationRequest
): Promise<TranslationResponse> {
  const sourceLangCode = INDIC_LANGUAGE_CODES[request.sourceLang] || request.sourceLang
  const targetLangCode = INDIC_LANGUAGE_CODES[request.targetLang] || request.targetLang

  const startTime = Date.now()

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/translate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: request.text,
        source_lang: sourceLangCode,
        target_lang: targetLangCode,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`)
  }

  const data = await response.json()
  const processingTime = (Date.now() - startTime) / 1000

  return {
    translatedText: data.translated_text || data.text,
    sourceLang: request.sourceLang,
    targetLang: request.targetLang,
    confidence: data.confidence || 0.85,
    processingTime,
  }
}

/**
 * Batch translate multiple texts
 */
export async function translateBatch(
  texts: string[],
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponse[]> {
  const sourceLangCode = INDIC_LANGUAGE_CODES[sourceLang] || sourceLang
  const targetLangCode = INDIC_LANGUAGE_CODES[targetLang] || targetLang

  const startTime = Date.now()

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/translate/batch`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        source_lang: sourceLangCode,
        target_lang: targetLangCode,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Batch translation failed: ${response.statusText}`)
  }

  const data = await response.json()
  const processingTime = (Date.now() - startTime) / 1000

  return texts.map((text, idx) => ({
    translatedText: data.translations[idx] || '',
    sourceLang,
    targetLang,
    confidence: data.confidences?.[idx] || 0.85,
    processingTime: processingTime / texts.length,
  }))
}

/**
 * Extract translation metrics
 */
export function extractTranslationMetrics(
  original: string,
  translated: string,
  sourceLang: string,
  targetLang: string,
  confidence: number,
  processingTime: number
): TranslationMetrics {
  return {
    sourceLength: original.length,
    targetLength: translated.length,
    sourceLang,
    targetLang,
    confidence,
    processingTime,
    wordsPerSecond: (original.split(/\s+/).length / processingTime) || 0,
  }
}

/**
 * Format translation metrics for display
 */
export function formatTranslationMetrics(metrics: TranslationMetrics): {
  [key: string]: string | number
} {
  return {
    'Language Pair': `${metrics.sourceLang.toUpperCase()} → ${metrics.targetLang.toUpperCase()}`,
    'Source Length': `${metrics.sourceLength} chars`,
    'Target Length': `${metrics.targetLength} chars`,
    'Confidence': `${(metrics.confidence * 100).toFixed(1)}%`,
    'Processing Time': `${metrics.processingTime.toFixed(2)}s`,
    'Words/Second': `${metrics.wordsPerSecond.toFixed(2)}`,
  }
}

/**
 * Get all supported language pairs
 */
export function getSupportedLanguagePairs(): Array<{ from: string; to: string }> {
  const langs = Object.keys(INDIC_LANGUAGE_CODES)
  const pairs = []

  for (const from of langs) {
    for (const to of langs) {
      if (from !== to) {
        pairs.push({ from, to })
      }
    }
  }

  return pairs
}

/**
 * Validate translation request
 */
export function validateTranslationRequest(request: TranslationRequest): {
  valid: boolean
  error?: string
} {
  if (!request.text || request.text.trim().length === 0) {
    return { valid: false, error: 'Text cannot be empty' }
  }

  if (!INDIC_LANGUAGE_CODES[request.sourceLang]) {
    return {
      valid: false,
      error: `Unsupported source language: ${request.sourceLang}`,
    }
  }

  if (!INDIC_LANGUAGE_CODES[request.targetLang]) {
    return {
      valid: false,
      error: `Unsupported target language: ${request.targetLang}`,
    }
  }

  if (request.sourceLang === request.targetLang) {
    return {
      valid: false,
      error: 'Source and target languages cannot be the same',
    }
  }

  return { valid: true }
}
