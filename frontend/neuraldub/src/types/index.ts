// User types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: Date
}

// Translation types
export interface TranslationJob {
  id: string
  userId: string
  title: string
  sourceLanguage: string
  targetLanguage: string
  inputFile?: string
  outputFile?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: Date
  completedAt?: Date
}

// Voice Clone types
export interface VoiceClone {
  id: string
  userId: string
  name: string
  description: string
  audioSamples: string[]
  status: 'training' | 'ready' | 'failed'
  confidenceScore: number
  createdAt: Date
}

// Lip Sync types
export interface LipSyncJob {
  id: string
  userId: string
  videoFile: string
  audioFile: string
  voiceCloneId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  outputFile?: string
  createdAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Language types
export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}
