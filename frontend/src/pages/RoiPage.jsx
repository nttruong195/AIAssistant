import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { formatVND, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function RoiPage() {
  const [form, setForm] = useState({ initialInvestment: '100,000,000', finalValue: '150,000,000', months: '24' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/roi`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initialInvestment: parseNumber(form.initialInvestment), finalValue: parseNumber(form.finalValue), months: parseInt(form.months) }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }

  const isProfit = result?.profit >= 0

  return (
    <div className="page-container">
      <SEO title="Tính ROI đầu tư" description="Tính ROI, lợi nhuận và tỷ suất sinh lời hàng năm của khoản đầu tư." path="/roi" />
      <h1 className="page-title">📊 Tính ROI đầu tư</h1>
      <p className="page-subtitle">Tính lợi nhuận và tỷ suất sinh lời hàng năm của khoản đầu tư</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Vốn đầu tư ban đầu (VNĐ)">
            <NumberInput name="initialInvestment" value={form.initialInvestment} onChange={handleChange} required />
          </FormField>
          <FormField label="Giá trị hiện tại / dự kiến (VNĐ)">
            <NumberInput name="finalValue" value={form.finalValue} onChange={handleChange} required />
          </FormField>
          <FormField label="Thời gian nắm giữ (tháng)">
            <input name="months" type="number" value={form.months} onChange={handleChange} min="1" className="input-field" required />
          </FormField>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Đang tính...' : 'Tính ROI'}</button>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="Kết quả" accent>
              <ResultRow label="Vốn đầu tư"          value={formatVND(result.initialInvestment)} />
              <ResultRow label="Lợi nhuận"            value={<span className={isProfit ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{isProfit ? '+' : ''}{formatVND(result.profit)}</span>} />
              <ResultRow label="ROI"                  value={<span className={`font-bold text-xl ${isProfit ? 'text-green-600' : 'text-red-500'}`}>{result.roiPercent.toFixed(2)}%</span>} />
              <ResultRow label="Lợi nhuận / năm"     value={`${result.annualizedReturn.toFixed(2)}%`} highlight />
            </ResultCard>
            <ResultCard title="Đường tăng trưởng">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={result.projection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={v => `T${v}`} />
                  <YAxis tickFormatter={v => `${(v/1e6).toFixed(0)}tr`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatVND(v)} labelFormatter={l => `Tháng ${l}`} />
                  <ReferenceLine y={result.initialInvestment} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Vốn', fontSize: 10 }} />
                  <Line type="monotone" dataKey="value" name="Giá trị" stroke={isProfit ? '#22c55e' : '#ef4444'} dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ResultCard>
          </div>
        )}
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">ROI là gì?</h2>
          <p>ROI (Return on Investment) là tỷ suất sinh lời trên vốn đầu tư, đo lường hiệu quả của một khoản đầu tư. ROI = (Lợi nhuận / Vốn đầu tư) × 100%. Công cụ cũng tính CAGR (tăng trưởng kép hàng năm) cho đầu tư nhiều năm.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">ROI bao nhiêu là tốt?</h3><p className="mt-1">So sánh với lãi suất gửi ngân hàng (~6%/năm). Chứng khoán thường đạt 10–15%/năm dài hạn. BĐS 8–12%/năm tại Việt Nam.</p></div>
            <div><h3 className="font-medium text-gray-700">ROI và CAGR khác nhau thế nào?</h3><p className="mt-1">ROI là tổng %, CAGR là % trung bình mỗi năm. CAGR chính xác hơn khi so sánh đầu tư có thời gian khác nhau.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
