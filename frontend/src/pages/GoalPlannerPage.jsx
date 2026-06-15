import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { formatVND, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function GoalPlannerPage() {
  const [form, setForm] = useState({ goalAmount: '500,000,000', currentSavings: '50,000,000', monthsLeft: '60', annualRate: '7' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/goal-planner`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalAmount: parseNumber(form.goalAmount), currentSavings: parseNumber(form.currentSavings), monthsLeft: parseInt(form.monthsLeft), annualRate: parseFloat(form.annualRate) }),
      })
      setResult(await res.json())
    } catch { setError('Có lỗi xảy ra') } finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <SEO title="Quy hoạch mục tiêu tài chính" description="Tính số tiền cần tiết kiệm mỗi tháng để đạt mục tiêu tài chính." path="/goal-planner" />
      <h1 className="page-title">🎯 Quy hoạch mục tiêu tài chính</h1>
      <p className="page-subtitle">Tính số tiền cần tiết kiệm mỗi tháng để đạt mục tiêu</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Mục tiêu cần đạt (VNĐ)">
            <NumberInput name="goalAmount" value={form.goalAmount} onChange={handleChange} required />
          </FormField>
          <FormField label="Tiền đã có sẵn (VNĐ)">
            <NumberInput name="currentSavings" value={form.currentSavings} onChange={handleChange} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Thời gian (tháng)">
              <input name="monthsLeft" type="number" value={form.monthsLeft} onChange={handleChange} min="1" className="input-field" required />
            </FormField>
            <FormField label="Lãi suất dự kiến (%/năm)">
              <input name="annualRate" type="number" value={form.annualRate} onChange={handleChange} step="0.5" className="input-field" required />
            </FormField>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Đang tính...' : 'Lập kế hoạch'}</button>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="Kết quả" accent>
              <ResultRow label="Mục tiêu"               value={formatVND(result.goalAmount)} />
              <ResultRow label="Cần tiết kiệm / tháng"  value={formatVND(result.monthlyNeeded)} highlight />
              <ResultRow label="Tổng đóng góp"          value={formatVND(result.totalContributed)} />
              <ResultRow label="Lãi tích lũy"           value={formatVND(result.totalInterest)} />
            </ResultCard>
            <ResultCard title="Lộ trình tích lũy">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={result.yearlyProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={v => `T${v}`} />
                  <YAxis tickFormatter={v => `${(v/1e6).toFixed(0)}tr`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => formatVND(v)} labelFormatter={l => `Tháng ${l}`} />
                  <Legend />
                  <Area type="monotone" dataKey="contributed" name="Đã góp" stroke="#93c5fd" fill="#dbeafe" />
                  <Area type="monotone" dataKey="balance" name="Tổng tài sản" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  )
}
