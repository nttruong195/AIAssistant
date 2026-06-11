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
    </div>
  )
}
