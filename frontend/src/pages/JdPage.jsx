import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { useAi } from '../hooks/useAi'
import AiOutputBox from '../components/ui/AiOutputBox'

export default function JdPage() {
  const [position, setPosition]         = useState('')
  const [requirements, setRequirements] = useState('')
  const { output, loading, error, submit, reset } = useAi('/api/v1/ai/jd')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!position.trim()) return
    reset()
    submit({ position, requirements })
  }

  return (
    <div className="page-container">
      <SEO title="Tạo Job Description bằng AI" description="AI tạo Job Description hoàn chỉnh chuyên nghiệp theo vị trí và yêu cầu." path="/jd" />
      <h1 className="page-title">📋 Tạo Job Description</h1>
      <p className="page-subtitle">Nhập tên vị trí và yêu cầu cơ bản — AI tạo JD hoàn chỉnh, chuyên nghiệp.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vị trí tuyển dụng <span className="text-red-400">*</span>
            </label>
            <input value={position} onChange={e => setPosition(e.target.value)}
              placeholder="Ví dụ: Senior Java Backend Developer"
              disabled={loading} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Yêu cầu & thông tin thêm
            </label>
            <textarea value={requirements} onChange={e => setRequirements(e.target.value)}
              placeholder="Ví dụ: 3+ năm kinh nghiệm, thành thạo Spring Boot & microservices, lương 25-40tr, làm việc tại Hà Nội, hybrid..."
              rows={8} disabled={loading}
              className="input-field resize-y" />
          </div>
          <button type="submit" disabled={loading || !position.trim()}
            className="btn-primary">
            {loading ? 'Đang tạo...' : '✨ Tạo JD'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm">Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Tạo Job Description chuyên nghiệp</h2>
          <p>Job Description (JD) là bản mô tả công việc giúp thu hút đúng ứng viên. JD tốt cần rõ ràng về trách nhiệm, yêu cầu kỹ năng và quyền lợi. AI tạo JD chuẩn SEO cho các nền tảng tuyển dụng.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">JD tốt có gì?</h3><p className="mt-1">Tiêu đề rõ ràng, tóm tắt công ty, trách nhiệm cụ thể (5–8 điểm), yêu cầu bắt buộc vs mong muốn, quyền lợi hấp dẫn.</p></div>
            <div><h3 className="font-medium text-gray-700">Nên đăng JD ở đâu?</h3><p className="mt-1">TopCV, Vietnamworks, LinkedIn, ITviec (cho IT), Cake.me (thiết kế, creative).</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
