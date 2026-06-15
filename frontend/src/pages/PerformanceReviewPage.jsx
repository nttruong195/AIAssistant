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
    </div>
  )
}
