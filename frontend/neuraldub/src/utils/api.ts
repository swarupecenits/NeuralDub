// API configuration and helper functions
// Backend URL - Update this based on your backend configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_PROFILE: '/auth/profile',

  // Translations
  TRANSLATIONS_LIST: '/translations',
  TRANSLATIONS_CREATE: '/translations',
  TRANSLATIONS_GET: (id: string) => `/translations/${id}`,
  TRANSLATIONS_DELETE: (id: string) => `/translations/${id}`,

  // Voice Clones
  VOICE_CLONES_LIST: '/voice-clones',
  VOICE_CLONES_CREATE: '/voice-clones',
  VOICE_CLONES_GET: (id: string) => `/voice-clones/${id}`,
  VOICE_CLONES_DELETE: (id: string) => `/voice-clones/${id}`,
  VOICE_CLONES_TRAIN: (id: string) => `/voice-clones/${id}/train`,

  // Lip Sync
  LIP_SYNC_LIST: '/lip-sync',
  LIP_SYNC_CREATE: '/lip-sync',
  LIP_SYNC_GET: (id: string) => `/lip-sync/${id}`,
  LIP_SYNC_DELETE: (id: string) => `/lip-sync/${id}`,

  // Speech Recognition (Whisper)
  WHISPER_TRANSCRIBE: '/speech/transcribe',

  // Translation (IndicTrans2)
  TRANSLATE: '/translate',
  TRANSLATE_BATCH: '/translate/batch',

  // Jobs
  JOBS_STATUS: (id: string) => `/jobs/${id}/status`,
  JOBS_CANCEL: (id: string) => `/jobs/${id}/cancel`,
}

// API call wrapper with error handling
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// Mock API for development - Remove when backend is ready
export const mockApi = {
  getTranslations: async () => {
    return []
  },
  getVoiceClones: async () => {
    return []
  },
  getLipSyncJobs: async () => {
    return []
  },
}
