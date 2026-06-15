import SEO from '../components/ui/SEO'
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
      <SEO title="Viết thư xin việc bằng AI" description="AI viết thư xin việc chuyên nghiệp dựa trên JD và thông tin ứng viên." path="/cover-letter" />
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
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Thư xin việc chuyên nghiệp</h2>
          <p>Cover letter là thư giới thiệu bản thân đi kèm CV, giúp nhà tuyển dụng hiểu lý do bạn phù hợp với vị trí. AI sẽ viết cover letter cá nhân hóa dựa trên JD và thông tin bạn cung cấp.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Cover letter có cần thiết không?</h3><p className="mt-1">Ở Việt Nam không bắt buộc, nhưng gửi kèm giúp bạn nổi bật hơn, đặc biệt với công ty nước ngoài.</p></div>
            <div><h3 className="font-medium text-gray-700">Cover letter dài bao nhiêu?</h3><p className="mt-1">Tối đa 1 trang, 3–4 đoạn: mở đầu, kinh nghiệm phù hợp, lý do muốn gia nhập, kết thúc.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
