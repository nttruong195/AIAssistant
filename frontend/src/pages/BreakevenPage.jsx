import { useState } from 'react'
import { formatVND, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function BreakevenPage() {
  const [form, setForm] = useState({
    fixedCosts: '50,000,000',
    variableCostPerUnit: '200,000',
    pricePerUnit: '350,000',
    targetProfit: '20,000,000',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/breakeven`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fixedCosts: parseNumber(form.fixedCosts),
          variableCostPerUnit: parseNumber(form.variableCostPerUnit),
          pricePerUnit: parseNumber(form.pricePerUnit),
          targetProfit: parseNumber(form.targetProfit),
        }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">⚖️ Tính Điểm Hòa Vốn</h1>
      <p className="page-subtitle">Tính doanh thu và số lượng cần bán để hòa vốn hoặc đạt lợi nhuận mục tiêu</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Chi phí cố định / tháng (VNĐ)" hint="Mặt bằng, lương nhân viên, khấu hao...">
            <NumberInput name="fixedCosts" value={form.fixedCosts} onChange={handleChange} required />
          </FormField>
          <FormField label="Chi phí biến đổi / đơn vị (VNĐ)" hint="Nguyên liệu, hoa hồng...">
            <NumberInput name="variableCostPerUnit" value={form.variableCostPerUnit} onChange={handleChange} required />
          </FormField>
          <FormField label="Giá bán / đơn vị (VNĐ)">
            <NumberInput name="pricePerUnit" value={form.pricePerUnit} onChange={handleChange} required />
          </FormField>
          <FormField label="Lợi nhuận mục tiêu / tháng (VNĐ)" hint="Nhập 0 để chỉ tính hòa vốn">
            <NumberInput name="targetProfit" value={form.targetProfit} onChange={handleChange} />
          </FormField>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang tính...' : 'Tính điểm hòa vốn'}
          </button>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="Điểm hòa vốn" accent>
              <ResultRow label="Biên lợi nhuận góp / đơn vị" value={formatVND(result.contributionMargin)} />
              <ResultRow label="Tỷ lệ LN góp" value={`${result.contributionMarginRatio.toFixed(1)}%`} />
              <ResultRow label="Số lượng hòa vốn" value={<span className="font-bold text-orange-500">{Math.ceil(result.breakevenUnits).toLocaleString()} đơn vị</span>} highlight />
              <ResultRow label="Doanh thu hòa vốn" value={formatVND(result.breakevenRevenue)} />
            </ResultCard>

            {result.targetRevenue > result.breakevenRevenue && (
              <ResultCard title="Để đạt lợi nhuận mục tiêu">
                <ResultRow label="Số lượng cần bán" value={<span className="font-bold text-blue-600">{Math.ceil(result.targetUnits).toLocaleString()} đơn vị</span>} highlight />
                <ResultRow label="Doanh thu cần đạt" value={formatVND(result.targetRevenue)} />
              </ResultCard>
            )}

            <ResultCard title="Biểu đồ hòa vốn">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="units" tick={{ fontSize: 10 }} tickFormatter={v => v.toLocaleString()} />
                  <YAxis tickFormatter={v => `${(v/1e6).toFixed(0)}tr`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={v => formatVND(v)} labelFormatter={l => `${Number(l).toLocaleString()} đơn vị`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReferenceLine x={Math.ceil(result.breakevenUnits)} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'HV', fontSize: 10, fill: '#f59e0b' }} />
                  <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#3b82f6" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="totalCost" name="Tổng chi phí" stroke="#ef4444" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  )
}
