import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { formatVND, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function InsurancePage() {
  const [form, setForm] = useState({ age: '30', gender: 'MALE', coverageAmount: '500,000,000', termYears: '20' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/insurance`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age: parseInt(form.age), gender: form.gender, coverageAmount: parseNumber(form.coverageAmount), termYears: parseInt(form.termYears) }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <SEO title="Ước tính phí bảo hiểm nhân thọ" description="Ước tính phí bảo hiểm nhân thọ theo tuổi, giới tính và mức bảo vệ mong muốn." path="/insurance" />
      <h1 className="page-title">🛡️ Ước tính phí bảo hiểm nhân thọ</h1>
      <p className="page-subtitle">Ước tính phí bảo hiểm dựa trên tuổi, giới tính và mức bảo vệ mong muốn</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tuổi">
              <input name="age" type="number" value={form.age} onChange={handleChange} min="18" max="65" className="input-field" required />
            </FormField>
            <FormField label="Giới tính">
              <div className="flex gap-2">
                {[['MALE', 'Nam'], ['FEMALE', 'Nữ']].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setForm(p => ({ ...p, gender: v }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${form.gender === v ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </FormField>
          </div>
          <FormField label="Mức bảo vệ (VNĐ)">
            <NumberInput name="coverageAmount" value={form.coverageAmount} onChange={handleChange} required />
          </FormField>
          <FormField label="Thời hạn bảo hiểm (năm)">
            <div className="flex gap-2">
              {[10, 15, 20, 25].map(y => (
                <button key={y} type="button" onClick={() => setForm(p => ({ ...p, termYears: String(y) }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${form.termYears === String(y) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`}>
                  {y} năm
                </button>
              ))}
            </div>
          </FormField>
          <p className="text-xs text-gray-400">⚠️ Số liệu ước tính, phí thực tế do công ty BH xác định.</p>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Đang tính...' : 'Ước tính phí'}</button>
        </form>

        {result && (
          <ResultCard title="Kết quả ước tính" accent>
            <ResultRow label="Mức bảo vệ"         value={formatVND(result.coverageAmount)} />
            <ResultRow label="Phí / tháng"         value={formatVND(result.monthlyPremium)} highlight />
            <ResultRow label="Phí / năm"           value={formatVND(result.annualPremium)} />
            <ResultRow label="Tổng phí toàn kỳ"   value={formatVND(result.totalPremium)} />
            <ResultRow label="Hệ số bảo vệ"       value={`${result.coverageRatio.toFixed(1)}x`} />
            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
              💡 Mức bảo vệ khuyến nghị = 10× thu nhập năm. Hệ số bảo vệ {result.coverageRatio.toFixed(1)}x {result.coverageRatio >= 10 ? '✅ đủ tốt' : '— nên tăng thêm'}.
            </div>
          </ResultCard>
        )}
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Bảo hiểm nhân thọ là gì?</h2>
          <p>Bảo hiểm nhân thọ bảo vệ tài chính cho gia đình khi người trụ cột gặp rủi ro tử vong hoặc thương tật. Mức bảo hiểm khuyến nghị thường bằng 10 lần thu nhập năm để gia đình duy trì cuộc sống trong 10 năm.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Nên mua bảo hiểm bao nhiêu?</h3><p className="mt-1">Tối thiểu bằng 5–10 lần thu nhập năm, cộng thêm các khoản nợ hiện có (vay nhà, vay xe).</p></div>
            <div><h3 className="font-medium text-gray-700">Bảo hiểm nhân thọ và bảo hiểm nhân thọ kết hợp đầu tư khác gì?</h3><p className="mt-1">Bảo hiểm thuần túy (term life) phí thấp, bảo vệ cao. Bảo hiểm kết hợp đầu tư phí cao hơn nhưng tích lũy giá trị tiền mặt.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
