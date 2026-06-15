import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { useAi } from '../hooks/useAi'
import AiOutputBox from '../components/ui/AiOutputBox'

export default function SalaryNegotiationPage() {
  const [form, setForm] = useState({ currentOffer: '', candidateInfo: '', marketInfo: '' })
  const { output, loading, error, submit, reset } = useAi('/api/v1/ai/salary-negotiation')

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.currentOffer.trim() || !form.candidateInfo.trim()) return
    reset()
    submit(form)
  }

  return (
    <div className="page-container">
      <SEO title="Đàm phán lương bằng AI" description="AI tư vấn script và chiến lược đàm phán tăng lương hiệu quả." path="/salary-negotiation" />
      <h1 className="page-title">💰 Salary Negotiation Coach</h1>
      <p className="page-subtitle">AI tư vấn chiến lược đàm phán lương, script cụ thể và những điều nên/không nên nói</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Offer hiện tại <span className="text-red-400">*</span>
            </label>
            <textarea name="currentOffer" value={form.currentOffer} onChange={handleChange}
              placeholder={`Ví dụ:\n- Mức lương đề xuất: 25 triệu gross\n- Thưởng: tháng 13\n- Công ty: startup 50 người\n- Vị trí: Senior FE Developer`}
              rows={5} disabled={loading} className="input-field resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Thông tin của bạn <span className="text-red-400">*</span>
            </label>
            <textarea name="candidateInfo" value={form.candidateInfo} onChange={handleChange}
              placeholder={`Ví dụ:\n- 4 năm kinh nghiệm React, TypeScript\n- Hiện tại đang nhận 22 triệu\n- Có 2 offer khác từ 28-30 triệu`}
              rows={4} disabled={loading} className="input-field resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kỳ vọng / Thông tin thị trường
            </label>
            <textarea name="marketInfo" value={form.marketInfo} onChange={handleChange}
              placeholder={`Ví dụ:\n- Mong muốn 30 triệu\n- Theo ITviec, Senior FE tại HN khoảng 25-35tr`}
              rows={3} disabled={loading} className="input-field resize-y" />
          </div>
          <button type="submit" disabled={loading || !form.currentOffer.trim() || !form.candidateInfo.trim()} className="btn-primary">
            {loading ? 'Đang phân tích...' : '🎯 Tư vấn đàm phán lương'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">💰</p>
              <p className="text-sm">Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
