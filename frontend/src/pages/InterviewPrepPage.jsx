import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { useAi } from '../hooks/useAi'
import AiOutputBox from '../components/ui/AiOutputBox'

export default function InterviewPrepPage() {
  const [form, setForm] = useState({ jobDescription: '', candidateBackground: '' })
  const { output, loading, error, submit, reset } = useAi('/api/v1/ai/interview-prep')

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.jobDescription.trim()) return
    reset()
    submit(form)
  }

  return (
    <div className="page-container">
      <SEO title="Luyện phỏng vấn bằng AI" description="AI sinh câu hỏi phỏng vấn và gợi ý trả lời dựa trên JD và CV của bạn." path="/interview-prep" />
      <h1 className="page-title">🎤 Interview Prep</h1>
      <p className="page-subtitle">Nhập JD và background — AI sinh câu hỏi phỏng vấn thực tế kèm gợi ý trả lời</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Job Description <span className="text-red-400">*</span>
            </label>
            <textarea name="jobDescription" value={form.jobDescription} onChange={handleChange}
              placeholder="Dán JD từ bài đăng tuyển dụng..."
              rows={7} disabled={loading} className="input-field resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Background của bạn
            </label>
            <textarea name="candidateBackground" value={form.candidateBackground} onChange={handleChange}
              placeholder={`Ví dụ:\n- 3 năm kinh nghiệm Java Spring Boot\n- Background banking domain\n- Yếu về system design`}
              rows={4} disabled={loading} className="input-field resize-y" />
          </div>
          <button type="submit" disabled={loading || !form.jobDescription.trim()} className="btn-primary">
            {loading ? 'Đang tạo câu hỏi...' : '🎤 Luyện phỏng vấn'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">🎤</p>
              <p className="text-sm">Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
