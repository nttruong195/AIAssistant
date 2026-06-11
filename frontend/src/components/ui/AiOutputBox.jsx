import { useState } from 'react'

export default function AiOutputBox({ output, loading, error, onCopy }) {
  const [copied, setCopied] = useState(false)

  if (!output && !loading && !error) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Kết quả AI</span>
        </div>
        {output && (
          <button onClick={handleCopy}
            className={`text-xs font-medium px-2.5 py-1 rounded-lg transition ${
              copied
                ? 'bg-green-100 text-green-600'
                : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-200'
            }`}>
            {copied ? '✓ Đã sao chép' : 'Sao chép'}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 min-h-[140px]">
        {error && (
          <div className="flex items-start gap-2 text-red-500 text-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {output && (
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
            {output}
          </pre>
        )}

        {loading && !output && (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-gray-400">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <span className="text-xs">AI đang phân tích...</span>
          </div>
        )}

        {loading && output && (
          <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  )
}
