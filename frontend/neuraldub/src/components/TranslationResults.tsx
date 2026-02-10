import React from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Share2 } from 'lucide-react'
import { Button } from './Button'

interface TranslationResult {
  originalText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  metrics: {
    [key: string]: string | number
  }
  recognitionMetrics?: {
    [key: string]: string | number
  }
}

interface TranslationResultsProps {
  result: TranslationResult
  onDownload?: () => void
  onShare?: () => void
}

export function TranslationResults({
  result,
  onDownload,
  onShare,
}: TranslationResultsProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6">
      {/* Recognition Results (if available) */}
      {result.recognitionMetrics && (
        <motion.div
          variants={itemVariants}
          className="bg-[#0A1628] rounded-xl border border-purple-500/30 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
            🎤 Speech Recognition Results
          </h3>

          {/* Original Recognized Text */}
          <div className="bg-[#051220] rounded-lg p-4 mb-4 border border-purple-500/20">
            <p className="text-xs text-purple-400 font-semibold mb-2 uppercase tracking-wide">
              Recognized Text
            </p>
            <p className="text-gray-100 leading-relaxed break-words">
              {result.originalText}
            </p>
            <button
              onClick={() => copyToClipboard(result.originalText)}
              className="mt-2 text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 transition-colors">
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>

          {/* Recognition Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(result.recognitionMetrics).map(([key, value]) => (
              <div key={key} className="bg-[#051220] rounded-lg p-3 border border-purple-500/20">
                <p className="text-xs text-purple-400 font-semibold uppercase mb-1">
                  {key}
                </p>
                <p className="text-white font-bold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Translation Results */}
      <motion.div
        variants={itemVariants}
        className="bg-[#0A1628] rounded-xl border border-cyan-500/30 p-6">
        <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
          🌐 Translation Results
        </h3>

        {/* Source Text */}
        <div className="bg-[#051220] rounded-lg p-4 mb-4 border border-cyan-500/20">
          <p className="text-xs text-cyan-400 font-semibold mb-2 uppercase tracking-wide">
            {result.sourceLang.toUpperCase()} (Original)
          </p>
          <p className="text-gray-100 leading-relaxed break-words">
            {result.originalText}
          </p>
          <button
            onClick={() => copyToClipboard(result.originalText)}
            className="mt-2 text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors">
            <Copy className="w-3 h-3" />
            Copy
          </button>
        </div>

        {/* Translated Text */}
        <div className="bg-[#051220] rounded-lg p-4 mb-4 border border-cyan-500/20">
          <p className="text-xs text-cyan-400 font-semibold mb-2 uppercase tracking-wide">
            {result.targetLang.toUpperCase()} (Translation)
          </p>
          <p className="text-gray-100 leading-relaxed break-words">
            {result.translatedText}
          </p>
          <button
            onClick={() => copyToClipboard(result.translatedText)}
            className="mt-2 text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors">
            <Copy className="w-3 h-3" />
            Copy
          </button>
        </div>

        {/* Translation Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(result.metrics).map(([key, value]) => (
            <div key={key} className="bg-[#051220] rounded-lg p-3 border border-cyan-500/20">
              <p className="text-xs text-cyan-400 font-semibold uppercase mb-1">
                {key}
              </p>
              <p className="text-white font-bold text-sm">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex gap-3 flex-wrap">
        <Button
          onClick={() => copyToClipboard(result.translatedText)}
          variant="secondary"
          className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Copy Translation
        </Button>
        {onDownload && (
          <Button
            onClick={onDownload}
            variant="secondary"
            className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        )}
        {onShare && (
          <Button
            onClick={onShare}
            variant="secondary"
            className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        )}
      </motion.div>

      {/* Detailed Breakdown */}
      <motion.details
        variants={itemVariants}
        className="bg-[#0A1628] rounded-xl border border-white/10 p-4 cursor-pointer hover:border-white/20 transition-colors">
        <summary className="font-semibold text-white flex items-center gap-2">
          <span>📊 Detailed Analysis</span>
        </summary>
        <div className="mt-4 space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 font-semibold mb-2">Recognition Confidence Breakdown</p>
              {result.recognitionMetrics?.['Confidence'] && (
                <div className="bg-[#051220] rounded p-3 border border-purple-500/20">
                  <p className="text-purple-300">
                    Model Confidence: {result.recognitionMetrics['Confidence']}
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-400 font-semibold mb-2">Translation Quality Metrics</p>
              <div className="bg-[#051220] rounded p-3 border border-cyan-500/20">
                <p className="text-cyan-300">
                  Confidence: {result.metrics['Confidence'] || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#051220] rounded p-3 border border-white/10">
            <p className="text-gray-400 font-semibold mb-2">Processing Summary</p>
            <ul className="space-y-1 text-gray-300 text-xs">
              {result.recognitionMetrics?.['Processing Time'] && (
                <li>
                  • Speech Recognition Time: {result.recognitionMetrics['Processing Time']}
                </li>
              )}
              {result.metrics['Processing Time'] && (
                <li>• Translation Time: {result.metrics['Processing Time']}</li>
              )}
              <li>• Total Words Processed: {result.metrics['Source Length'] || 'N/A'}</li>
              <li>
                • Character Expansion Ratio:{' '}
                {((
                  (parseInt(String(result.metrics['Target Length'])) /
                    parseInt(String(result.metrics['Source Length']))) *
                  100
                ).toFixed(1) || 'N/A')}
                %
              </li>
            </ul>
          </div>
        </div>
      </motion.details>
    </motion.div>
  )
}

export default TranslationResults
