import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { useAi } from '../hooks/useAi'
import AiOutputBox from '../components/ui/AiOutputBox'

export default function PerformanceReviewPage() {
  const [form, setForm] = useState({ role: '', period: '', achievements: '' })
  const { output, loading, error, submit, reset } = useAi('/api/v1/ai/performance-review')

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.achievements.trim() || !form.role.trim() || !form.period.trim()) return
    reset()
    submit(form)
  }

  return (
    <div className="page-container">
      <SEO title="Viết Performance Review bằng AI" description="AI viết self-review đánh giá hiệu suất cuối năm chuyên nghiệp." path="/performance-review" />
      <h1 className="page-title">⭐ Performance Review Writer</h1>
      <p className="page-subtitle">Nhập thành tích của bạn — AI viết self-review chuyên nghiệp, có số liệu và SMART goals</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vị trí / Vai trò <span className="text-red-400">*</span>
              </label>
              <input name="role" value={form.role} onChange={handleChange}
                placeholder="Ví dụ: Senior Java Developer"
                disabled={loading} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kỳ đánh giá <span className="text-red-400">*</span>
              </label>
              <input name="period" value={form.period} onChange={handleChange}
                placeholder="Ví dụ: Q2/2025"
                disabled={loading} className="input-field" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Thành tích / Công việc đã làm <span className="text-red-400">*</span>
            </label>
            <textarea name="achievements" value={form.achievements} onChange={handleChange}
              placeholder={`Liệt kê những gì bạn đã làm:\n- Optimize API giảm latency từ 800ms → 200ms\n- Lead team 3 người deliver dự án đúng deadline\n- Viết unit test coverage từ 40% → 85%\n- Onboard 2 junior developer mới`}
              rows={8} disabled={loading} className="input-field resize-y" />
          </div>
          <button type="submit"
            disabled={loading || !form.achievements.trim() || !form.role.trim() || !form.period.trim()}
            className="btn-primary">
            {loading ? 'Đang viết...' : '⭐ Viết Performance Review'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">⭐</p>
              <p className="text-sm">Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Viết self-review chuyên nghiệp</h2>
          <p>Performance review tự đánh giá (self-review) là cơ hội để thể hiện đóng góp và đặt mục tiêu phát triển. AI giúp bạn viết self-review có số liệu, cụ thể và thuyết phục với quản lý.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Self-review nên tập trung vào gì?</h3><p className="mt-1">Thành tích cụ thể có số liệu, bài học từ thất bại (growth mindset), kế hoạch phát triển rõ ràng cho kỳ tiếp theo.</p></div>
            <div><h3 className="font-medium text-gray-700">Nên dài bao nhiêu?</h3><p className="mt-1">300–500 từ. Súc tích, tập trung vào top 3–5 thành tích nổi bật thay vì liệt kê tất cả mọi thứ.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
