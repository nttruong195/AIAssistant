import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { useAi } from '../hooks/useAi'
import AiOutputBox from '../components/ui/AiOutputBox'

const EMAIL_TYPES = [
  'Xin nghỉ phép', 'Xin tăng lương', 'Từ chối offer', 'Chấp nhận offer',
  'Xin thôi việc', 'Cảm ơn sau phỏng vấn', 'Follow-up ứng tuyển',
  'Báo cáo công việc', 'Yêu cầu họp', 'Khác...',
]

export default function EmailPage() {
  const [emailType, setEmailType] = useState(EMAIL_TYPES[0])
  const [customType, setCustomType] = useState('')
  const [context, setContext]       = useState('')
  const { output, loading, error, submit, reset } = useAi('/api/v1/ai/email')

  const handleSubmit = (e) => {
    e.preventDefault()
    const type = emailType === 'Khác...' ? customType : emailType
    if (!type.trim() || !context.trim()) return
    reset()
    submit({ emailType: type, context })
  }

  return (
    <div className="page-container">
      <SEO title="Viết email chuyên nghiệp bằng AI" description="AI viết email công sở chuyên nghiệp: xin nghỉ phép, xin tăng lương, cảm ơn sau phỏng vấn..." path="/email" />
      <h1 className="page-title">📧 Viết Email Chuyên Nghiệp</h1>
      <p className="page-subtitle">Chọn loại email, mô tả tình huống — AI viết hoàn chỉnh cho bạn.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại email</label>
            <div className="flex flex-wrap gap-2">
              {EMAIL_TYPES.map(t => (
                <button key={t} type="button" onClick={() => setEmailType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    emailType === t
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {emailType === 'Khác...' && (
            <input value={customType} onChange={e => setCustomType(e.target.value)}
              placeholder="Nhập loại email..." disabled={loading}
              className="input-field" />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Thông tin / ngữ cảnh <span className="text-red-400">*</span>
            </label>
            <textarea value={context} onChange={e => setContext(e.target.value)}
              placeholder="Ví dụ: Tôi muốn nghỉ 3 ngày 20-22/6 để đi đám cưới tại Đà Nẵng. Tên tôi là Nguyễn Văn A, nhân viên phòng IT."
              rows={6} disabled={loading}
              className="input-field resize-y" />
          </div>

          <button type="submit" disabled={loading || !context.trim()}
            className="btn-primary">
            {loading ? 'Đang tạo...' : '✨ Tạo Email'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">📧</p>
              <p className="text-sm">Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Viết email công sở chuyên nghiệp</h2>
          <p>Email công sở cần ngắn gọn, rõ ràng và chuyên nghiệp. AI hỗ trợ viết các loại email: xin việc, follow-up sau phỏng vấn, từ chối offer, xin tăng lương, báo cáo công việc.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Email xin việc cần có gì?</h3><p className="mt-1">Subject rõ ràng (tên vị trí + họ tên), giới thiệu ngắn, đính kèm CV, lời cảm ơn và CTA (mời phỏng vấn).</p></div>
            <div><h3 className="font-medium text-gray-700">Nên gửi email lúc nào?</h3><p className="mt-1">Thứ 2–4, buổi sáng 8–10h hoặc sau bữa trưa 13–15h. Tránh thứ 6 chiều và cuối tuần.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
