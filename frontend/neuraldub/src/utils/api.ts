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
  LIP_SYNC_HEALTH: '/lip-sync/health',
  LIP_SYNC_GENERATE: '/lip-sync/generate',
  LIP_SYNC_STATUS: (jobId: string) => `/lip-sync/status/${jobId}`,
  LIP_SYNC_DOWNLOAD: (jobId: string) => `/lip-sync/download/${jobId}`,
  LIP_SYNC_CLEANUP: (jobId: string) => `/lip-sync/cleanup/${jobId}`,
  LIP_SYNC_JOBS: '/lip-sync/jobs',

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

// Lip Sync API functions
export const lipSyncApi = {
  // Generate lip-synced video
  generate: async (videoFile: File, audioFile: File, bboxShift: number = 0) => {
    const formData = new FormData()
    formData.append('video', videoFile)
    formData.append('audio', audioFile)
    formData.append('bbox_shift', bboxShift.toString())

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LIP_SYNC_GENERATE}`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to generate lip sync')
    }

    return response.json()
  },

  // Check job status
  getStatus: async (jobId: string) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LIP_SYNC_STATUS(jobId)}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get status')
    }

    return response.json()
  },

  // Download result
  download: async (jobId: string) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LIP_SYNC_DOWNLOAD(jobId)}`)
    
    if (!response.ok) {
      throw new Error('Failed to download video')
    }

    return response.blob()
  },

  // Get download URL
  getDownloadUrl: (jobId: string) => {
    return `${API_BASE_URL}${API_ENDPOINTS.LIP_SYNC_DOWNLOAD(jobId)}`
  },

  // Check health
  checkHealth: async () => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LIP_SYNC_HEALTH}`)
    return response.json()
  },
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
