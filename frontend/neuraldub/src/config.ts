// Environment configuration
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

export const config = {
  // Backend API URL
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',

  // Features
  features: {
    voiceCloning: true,
    lipSync: true,
    multiLanguage: true,
    realTimeProcessing: true,
  },

  // App Info
  appName: 'NeuralDub',
  appVersion: '1.0.0',
  appDescription: 'Advanced Speech to Speech Translation with Voice Cloning and Lip Syncing',

  // Environment
  isDevelopment,
  isProduction,

  // Limits
  maxFileSize: 1024 * 1024 * 1024, // 1GB
  maxAudioDuration: 3600, // 1 hour in seconds
  maxVoiceSamples: 100,
  minVoiceSamples: 3,

  // Supported Languages
  supportedLanguages: [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ko', 'ru', 'hi', 'ar'
  ],
}

export default config
