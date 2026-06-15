import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { formatVND, formatPercent, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const TERMS = [
  { label: '1 tháng',   months: 1,   rate: '3.8' },
  { label: '3 tháng',   months: 3,   rate: '4.2' },
  { label: '6 tháng',   months: 6,   rate: '5.0' },
  { label: '12 tháng',  months: 12,  rate: '5.8' },
  { label: '18 tháng',  months: 18,  rate: '6.2' },
  { label: '24 tháng',  months: 24,  rate: '6.5' },
]

export default function SavingsPage() {
  const [principal, setPrincipal] = useState('100,000,000')
  const [annualRate, setAnnualRate] = useState('5.8')
  const [termMonths, setTermMonths] = useState('12')
  const [interestType, setInterestType] = useState('END_OF_TERM')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/savings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ principal: parseNumber(principal), annualRate: parseFloat(annualRate), termMonths: parseInt(termMonths), interestType }),
      })
      setResult(await res.json())
    } catch { setError('Có lỗi xảy ra') } finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <SEO title="Tính lãi tiết kiệm ngân hàng" description="Tính lãi tiết kiệm ngân hàng theo kỳ hạn 1-24 tháng. So sánh lĩnh lãi cuối kỳ và hàng tháng." path="/savings" />
      <h1 className="page-title">🏦 Tính lãi tiết kiệm</h1>
      <p className="page-subtitle">Tính lãi suất tiết kiệm ngân hàng theo kỳ hạn</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Số tiền gửi (VNĐ)">
            <NumberInput name="principal" value={principal} onChange={e => setPrincipal(e.target.value)} required />
          </FormField>
          <FormField label="Kỳ hạn nhanh">
            <div className="grid grid-cols-3 gap-2">
              {TERMS.map(t => (
                <button key={t.months} type="button"
                  onClick={() => { setTermMonths(String(t.months)); setAnnualRate(t.rate) }}
                  className={`py-1.5 rounded-lg text-xs font-medium border transition ${
                    termMonths === String(t.months) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}>
                  {t.label}<br /><span className="opacity-70">{t.rate}%</span>
                </button>
              ))}
            </div>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kỳ hạn (tháng)">
              <input type="number" value={termMonths} onChange={e => setTermMonths(e.target.value)} min="1" className="input-field" required />
            </FormField>
            <FormField label="Lãi suất (%/năm)">
              <input type="number" value={annualRate} onChange={e => setAnnualRate(e.target.value)} step="0.1" className="input-field" required />
            </FormField>
          </div>
          <FormField label="Hình thức lĩnh lãi">
            <div className="flex gap-2">
              {[['END_OF_TERM', 'Cuối kỳ'], ['MONTHLY', 'Hàng tháng']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setInterestType(v)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${interestType === v ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`}>
                  {l}
                </button>
              ))}
            </div>
          </FormField>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Đang tính...' : 'Tính toán'}</button>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="Kết quả" accent>
              <ResultRow label="Số tiền gửi"     value={formatVND(result.principal)} />
              <ResultRow label="Tiền lãi nhận"   value={formatVND(result.interest)} />
              <ResultRow label="Nhận về cuối kỳ" value={formatVND(result.finalAmount)} highlight />
              <ResultRow label="Lãi suất hiệu quả" value={formatPercent(result.effectiveRate)} />
            </ResultCard>
            <ResultCard title="Tăng trưởng">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={result.monthlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: 'Tháng', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${(v/1e6).toFixed(0)}tr`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatVND(v)} labelFormatter={l => `Tháng ${l}`} />
                  <Area type="monotone" dataKey="balance" name="Số dư" stroke="#3b82f6" fill="#dbeafe" />
                </AreaChart>
              </ResponsiveContainer>
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  )
}
