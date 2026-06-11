import { useState, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

/**
 * Hook dùng chung cho mọi AI feature (SSE streaming)
 * @param {string} endpoint  — ví dụ '/api/v1/ai/cv-analyze'
 */
export function useAi(endpoint) {
  const [output, setOutput]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const abortRef                = useRef(null)

  const submit = async (body) => {
    setOutput('')
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      abortRef.current = reader

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        // Parse SSE lines:  "data: ...\n\n"
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') {
              setLoading(false)
              return
            }
            setOutput(prev => prev + data + '\n')
          }
          if (line.startsWith('event:error')) {
            setError('AI gặp lỗi, vui lòng thử lại.')
          }
        }
      }
    } catch (e) {
      setError(e.message || 'Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  const cancel = () => {
    abortRef.current?.cancel()
    setLoading(false)
  }

  const reset = () => {
    setOutput('')
    setError(null)
  }

  return { output, loading, error, submit, cancel, reset }
}
