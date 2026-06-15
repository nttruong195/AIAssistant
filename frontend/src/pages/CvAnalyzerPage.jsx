import SEO from '../components/ui/SEO'
import { useState, useRef } from 'react'
import AiOutputBox from '../components/ui/AiOutputBox'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function CvAnalyzerPage() {
  const [mode, setMode]         = useState('file')
  const [cvText, setCvText]     = useState('')
  const [file, setFile]         = useState(null)
  const [dragging, setDragging] = useState(false)
  const [output, setOutput]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const inputRef = useRef()

  const reset = () => { setOutput(''); setError(null) }

  const streamResponse = async (response) => {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      for (const line of chunk.split('\n')) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data === '[DONE]') return
          setOutput(prev => prev + data + '\n')
        }
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    reset()
    setLoading(true)
    try {
      let response
      if (mode === 'file' && file) {
        const form = new FormData()
        form.append('file', file)
        response = await fetch(`${API_BASE}/api/v1/ai/cv-analyze/upload`, { method: 'POST', body: form })
      } else {
        response = await fetch(`${API_BASE}/api/v1/ai/cv-analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cvText }),
        })
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      await streamResponse(response)
    } catch (e) {
      setError(e.message || 'Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const canSubmit = mode === 'file' ? !!file : !!cvText.trim()

  return (
    <div className="page-container">
      <SEO title="Phân tích CV bằng AI" description="AI phân tích CV tiếng Việt, đánh giá điểm mạnh yếu và gợi ý cải thiện." path="/cv-analyzer" />
      <h1 className="page-title">📄 Phân tích CV</h1>
      <p className="page-subtitle">Upload file hoặc dán text — AI phân tích điểm mạnh, điểm yếu và gợi ý cải thiện.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          {/* Mode tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {[['file', '📁 Upload file'], ['text', '📝 Dán text']].map(([m, label]) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition ${
                  mode === m ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {mode === 'file' ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                dragging
                  ? 'border-blue-400 bg-blue-50'
                  : file
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <input ref={inputRef} type="file" accept=".pdf,.docx,.txt"
                className="hidden" onChange={e => setFile(e.target.files[0])} />
              {file ? (
                <div>
                  <p className="text-2xl mb-2">✅</p>
                  <p className="text-green-700 font-semibold text-sm">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB · Click để đổi file</p>
                </div>
              ) : (
                <div>
                  <p className="text-3xl mb-2">📂</p>
                  <p className="text-sm text-gray-500">Kéo thả hoặc <span className="text-blue-600 font-semibold">click để chọn</span></p>
                  <p className="text-xs text-gray-300 mt-1">PDF · DOCX · TXT</p>
                </div>
              )}
            </div>
          ) : (
            <textarea value={cvText} onChange={e => setCvText(e.target.value)}
              placeholder="Dán toàn bộ nội dung CV vào đây..."
              rows={12} disabled={loading}
              className="input-field resize-y" />
          )}

          <button type="submit" disabled={loading || !canSubmit} className="btn-primary">
            {loading ? 'Đang phân tích...' : '✨ Phân tích CV'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">📄</p>
              <p className="text-sm">Kết quả phân tích sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
