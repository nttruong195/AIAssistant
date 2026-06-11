import { useState } from 'react'
import { useAi } from '../hooks/useAi'
import AiOutputBox from '../components/ui/AiOutputBox'

export default function CoverLetterPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [candidateInfo, setCandidateInfo]   = useState('')
  const { output, loading, error, submit, reset } = useAi('/api/v1/ai/cover-letter')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!jobDescription.trim() || !candidateInfo.trim()) return
    reset()
    submit({ jobDescription, candidateInfo })
  }

  return (
    <div className="page-container">
      <h1 className="page-title">✉️ Viết Thư Xin Việc</h1>
      <p className="page-subtitle">Nhập JD và thông tin của bạn — AI viết cover letter chuyên nghiệp trong vài giây.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mô tả công việc <span className="text-red-400">*</span>
            </label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
              placeholder="Dán JD từ bài đăng tuyển dụng..."
              rows={7} disabled={loading}
              className="input-field resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Thông tin bạn <span className="text-red-400">*</span>
            </label>
            <textarea value={candidateInfo} onChange={e => setCandidateInfo(e.target.value)}
              placeholder="Ví dụ: 3 năm kinh nghiệm Java, từng làm tại ..., thành thạo Spring Boot, React..."
              rows={5} disabled={loading}
              className="input-field resize-y" />
          </div>
          <button type="submit" disabled={loading || !jobDescription.trim() || !candidateInfo.trim()}
            className="btn-primary">
            {loading ? 'Đang tạo...' : '✨ Viết thư xin việc'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">✉️</p>
              <p className="text-sm">Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
