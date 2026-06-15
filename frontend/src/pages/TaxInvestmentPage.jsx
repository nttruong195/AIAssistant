import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { formatVND, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const TYPE_OPTIONS = [
  { value: 'stock',  label: '📈 Chứng khoán',         hint: '0.1% trên doanh thu bán' },
  { value: 'rental', label: '🏠 Cho thuê bất động sản', hint: '10% nếu ≥ 100tr/năm' },
  { value: 'bond',   label: '📄 Trái phiếu / Tiết kiệm', hint: '5% trên lãi' },
]

export default function TaxInvestmentPage() {
  const [form, setForm] = useState({
    type: 'stock',
    principal: '100,000,000',
    profit: '20,000,000',
    rentalIncome: '120,000,000',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/tax-investment`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          principal: parseNumber(form.principal),
          profit: parseNumber(form.profit),
          rentalIncome: parseNumber(form.rentalIncome),
        }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <SEO title="Tính thuế đầu tư chứng khoán" description="Tính thuế chứng khoán, bất động sản, trái phiếu theo quy định Việt Nam." path="/tax-investment" />
      <h1 className="page-title">🧾 Thuế Thu Nhập Đầu Tư</h1>
      <p className="page-subtitle">Tính thuế TNCN từ chứng khoán, cho thuê BĐS, trái phiếu theo quy định Việt Nam</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Loại đầu tư">
            <div className="space-y-2">
              {TYPE_OPTIONS.map(opt => (
                <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.type === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="type" value={opt.value} checked={form.type === opt.value} onChange={handleChange} className="accent-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.hint}</p>
                  </div>
                </label>
              ))}
            </div>
          </FormField>

          {form.type !== 'rental' && (
            <>
              <FormField label="Vốn đầu tư (VNĐ)">
                <NumberInput name="principal" value={form.principal} onChange={handleChange} required />
              </FormField>
              <FormField label="Lợi nhuận / Lãi phát sinh (VNĐ)">
                <NumberInput name="profit" value={form.profit} onChange={handleChange} required />
              </FormField>
            </>
          )}

          {form.type === 'rental' && (
            <FormField label="Thu nhập cho thuê / năm (VNĐ)">
              <NumberInput name="rentalIncome" value={form.rentalIncome} onChange={handleChange} required />
            </FormField>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang tính...' : 'Tính thuế'}
          </button>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="Kết quả thuế" accent>
              <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-3">{result.taxType}</p>
              <ResultRow label="Lợi nhuận / Lãi trước thuế" value={formatVND(result.grossProfit)} />
              <ResultRow label="Thuế phải nộp" value={<span className="text-red-500 font-bold">{formatVND(result.taxAmount)}</span>} />
              <ResultRow label="Lợi nhuận sau thuế" value={<span className="text-green-600 font-bold text-lg">{formatVND(result.netProfit)}</span>} highlight />
            </ResultCard>

            <ResultCard title="Chi tiết tính toán">
              {result.breakdown?.map((row, i) => (
                <ResultRow key={i} label={row.label} value={formatVND(row.value)} />
              ))}
            </ResultCard>

            <div className="result-card bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700">⚠️ Số liệu mang tính tham khảo. Thực tế có thể khác tùy từng trường hợp cụ thể. Tham khảo thêm tại cơ quan thuế địa phương.</p>
            </div>
          </div>
        )}
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Thuế đầu tư tại Việt Nam</h2>
          <p>Nhà đầu tư cá nhân tại Việt Nam phải nộp thuế: chứng khoán 0.1% trên giá trị bán (không tính lãi/lỗ), bất động sản 2% trên giá chuyển nhượng, trái phiếu và cổ tức 5% thuế TNCN. Biết trước thuế giúp tính toán lợi nhuận thực tế chính xác hơn.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Chứng khoán lỗ có phải nộp thuế không?</h3><p className="mt-1">Có — thuế 0.1% tính trên doanh số bán, không phân biệt lãi hay lỗ.</p></div>
            <div><h3 className="font-medium text-gray-700">Thuế BĐS tính thế nào?</h3><p className="mt-1">2% × giá chuyển nhượng ghi trên hợp đồng. Nếu giá hợp đồng thấp hơn giá thị trường, cơ quan thuế có thể áp giá thị trường.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
