import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { formatVND, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function InflationPage() {
  const [form, setForm] = useState({
    initialAmount: '100,000,000',
    nominalRate: '8',
    inflationRate: '4',
    years: '10',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/inflation`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialAmount: parseNumber(form.initialAmount),
          nominalRate: parseFloat(form.nominalRate),
          inflationRate: parseFloat(form.inflationRate),
          years: parseInt(form.years),
        }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <SEO title="Tính lãi suất thực sau lạm phát" description="Tính lãi suất thực sau lạm phát theo công thức Fisher." path="/inflation" />
      <h1 className="page-title">📉 Lãi Suất Thực Sau Lạm Phát</h1>
      <p className="page-subtitle">Tính lãi suất thực và sức mua của tiền theo công thức Fisher</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Số tiền ban đầu (VNĐ)">
            <NumberInput name="initialAmount" value={form.initialAmount} onChange={handleChange} required />
          </FormField>
          <FormField label="Lãi suất danh nghĩa (%/năm)" hint="Lãi suất ngân hàng / kỳ vọng đầu tư">
            <input name="nominalRate" type="number" value={form.nominalRate} onChange={handleChange}
              min="0" max="100" step="0.1" className="input-field" required />
          </FormField>
          <FormField label="Tỷ lệ lạm phát (%/năm)" hint="Lạm phát VN 2024 khoảng 3.6%">
            <input name="inflationRate" type="number" value={form.inflationRate} onChange={handleChange}
              min="0" max="100" step="0.1" className="input-field" required />
          </FormField>
          <FormField label="Số năm">
            <input name="years" type="number" value={form.years} onChange={handleChange}
              min="1" max="50" className="input-field" required />
          </FormField>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang tính...' : 'Tính lãi suất thực'}
          </button>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="Lãi suất thực" accent>
              <ResultRow label="Lãi suất danh nghĩa" value={`${result.nominalRate.toFixed(2)}%/năm`} />
              <ResultRow label="Lạm phát" value={`${result.inflationRate.toFixed(2)}%/năm`} />
              <ResultRow
                label="Lãi suất thực (Fisher)"
                value={<span className={`font-bold text-xl ${result.realRate >= 0 ? 'text-green-600' : 'text-red-500'}`}>{result.realRate.toFixed(2)}%/năm</span>}
                highlight
              />
            </ResultCard>

            <ResultCard title={`Sau ${result.years} năm`}>
              <ResultRow label="Giá trị danh nghĩa" value={formatVND(result.futureNominal)} />
              <ResultRow label="Sức mua thực tế" value={<span className="text-blue-600 font-bold">{formatVND(result.futurePurchasingPower)}</span>} highlight />
              <ResultRow label="Mất sức mua" value={<span className="text-red-500">-{formatVND(result.purchasingPowerLoss)}</span>} />
            </ResultCard>

            <ResultCard title="So sánh giá trị theo thời gian">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.projection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={v => `N${v}`} />
                  <YAxis tickFormatter={v => `${(v/1e6).toFixed(0)}tr`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatVND(v)} labelFormatter={l => `Năm ${l}`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="nominal" name="Giá trị danh nghĩa" stroke="#3b82f6" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="real" name="Sức mua thực tế" stroke="#10b981" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ResultCard>
          </div>
        )}
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Lãi suất thực là gì?</h2>
          <p>Lãi suất thực (real interest rate) là lãi suất sau khi đã trừ lạm phát, phản ánh sức mua thực sự tăng lên. Theo phương trình Fisher: Lãi suất thực ≈ Lãi suất danh nghĩa – Lạm phát. Nếu gửi tiết kiệm 6%/năm nhưng lạm phát 4%, lãi suất thực chỉ còn ~2%.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Lạm phát Việt Nam hiện nay bao nhiêu?</h3><p className="mt-1">Trung bình 3–4%/năm trong giai đoạn 2020–2024. CPI được công bố hàng tháng bởi Tổng cục Thống kê.</p></div>
            <div><h3 className="font-medium text-gray-700">Gửi tiết kiệm có thắng lạm phát không?</h3><p className="mt-1">Khó. Lãi suất tiết kiệm thực tế sau lạm phát thường chỉ 1–2%/năm, không đủ để tăng tài sản.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
