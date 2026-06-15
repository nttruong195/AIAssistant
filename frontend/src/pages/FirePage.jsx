import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { formatVND, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ResponsiveContainer } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function FirePage() {
  const [form, setForm] = useState({
    currentAge: '30',
    currentSavings: '200,000,000',
    monthlyExpenses: '15,000,000',
    annualReturn: '10',
    monthlySavings: '10,000,000',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/fire`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAge: parseInt(form.currentAge),
          currentSavings: parseNumber(form.currentSavings),
          monthlyExpenses: parseNumber(form.monthlyExpenses),
          annualReturn: parseFloat(form.annualReturn),
          monthlySavings: parseNumber(form.monthlySavings),
        }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <SEO title="Tính FIRE Number nghỉ hưu sớm" description="Tính FIRE Number và tuổi có thể nghỉ hưu sớm theo phương pháp Financial Independence." path="/fire" />
      <h1 className="page-title">🔥 Kế Hoạch Nghỉ Hưu Sớm (FIRE)</h1>
      <p className="page-subtitle">Tính toán khi nào bạn có thể nghỉ hưu tài chính theo nguyên tắc 4%</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Tuổi hiện tại">
            <input name="currentAge" type="number" value={form.currentAge} onChange={handleChange} min="18" max="70" className="input-field" required />
          </FormField>
          <FormField label="Tiết kiệm / đầu tư hiện có (VNĐ)">
            <NumberInput name="currentSavings" value={form.currentSavings} onChange={handleChange} required />
          </FormField>
          <FormField label="Chi tiêu hàng tháng khi nghỉ hưu (VNĐ)">
            <NumberInput name="monthlyExpenses" value={form.monthlyExpenses} onChange={handleChange} required />
          </FormField>
          <FormField label="Tiết kiệm / đầu tư mỗi tháng (VNĐ)">
            <NumberInput name="monthlySavings" value={form.monthlySavings} onChange={handleChange} required />
          </FormField>
          <FormField label="Lợi nhuận đầu tư hàng năm (%)">
            <input name="annualReturn" type="number" value={form.annualReturn} onChange={handleChange}
              min="0" max="50" step="0.1" className="input-field" required />
          </FormField>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang tính...' : '🔥 Tính FIRE number'}
          </button>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="FIRE Number" accent>
              <div className="text-center py-3">
                <p className="text-3xl font-bold text-blue-600">{formatVND(result.fireNumber)}</p>
                <p className="text-xs text-gray-400 mt-1">Số tiền cần tích lũy để nghỉ hưu</p>
              </div>
              <ResultRow label="Tuổi nghỉ hưu dự kiến" value={<span className="text-green-600 font-bold text-xl">{result.retireAge} tuổi</span>} highlight />
              <ResultRow label="Thời gian cần tích lũy" value={`${result.yearsToFire} năm`} />
              <ResultRow label="Chi tiêu/tháng sau nghỉ hưu" value={formatVND(result.monthlyExpenses)} />
              <ResultRow label="Tỷ lệ rút tiền an toàn" value={`${result.safeWithdrawalRate}%/năm`} />
            </ResultCard>

            {result.monthlySavingsNeeded > 0 && result.monthlySavingsNeeded !== result.monthlySavings && (
              <ResultCard title="Gợi ý tối ưu">
                <ResultRow label="Cần tiết kiệm tối thiểu/tháng" value={formatVND(result.monthlySavingsNeeded)} />
              </ResultCard>
            )}

            <ResultCard title="Lộ trình tích lũy">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.projection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={v => `${v}t`} />
                  <YAxis tickFormatter={v => `${(v/1e9).toFixed(1)}tỷ`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatVND(v)} labelFormatter={l => `Tuổi ${l}`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReferenceLine y={result.fireNumber} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'FIRE', fontSize: 10, fill: '#ef4444' }} />
                  <Line type="monotone" dataKey="balance" name="Tài sản" stroke="#3b82f6" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  )
}
