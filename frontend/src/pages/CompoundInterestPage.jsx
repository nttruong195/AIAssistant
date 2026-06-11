import { useCompoundInterest } from '../hooks/useCompoundInterest'
import { COMPOUND_FREQUENCY_OPTIONS } from '../constants'
import { formatVND, formatPercent } from '../utils/format'
import FormField from '../components/ui/FormField'
import NumberInput from '../components/ui/NumberInput'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CompoundInterestPage() {
  const { form, result, loading, error, handleChange, handleSubmit } = useCompoundInterest()

  return (
    <div className="page-container">
      <h1 className="page-title">📈 Tính lãi kép</h1>
      <p className="page-subtitle">Tính toán sức mạnh của lãi kép theo thời gian</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Vốn ban đầu (VNĐ)">
            <NumberInput name="principal" value={form.principal} onChange={handleChange} required />
          </FormField>
          <FormField label="Lãi suất năm (%)">
            <input name="annualRate" value={form.annualRate} onChange={handleChange}
              type="number" step="0.1" min="0" className="input-field" required />
          </FormField>
          <FormField label="Thời gian (năm)">
            <input name="years" value={form.years} onChange={handleChange}
              type="number" min="1" max="50" className="input-field" required />
          </FormField>
          <FormField label="Tần suất ghép lãi">
            <select name="compoundFrequency" value={form.compoundFrequency}
              onChange={handleChange} className="input-field">
              {COMPOUND_FREQUENCY_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Góp thêm hàng tháng (VNĐ)">
            <NumberInput name="monthlyContribution" value={form.monthlyContribution} onChange={handleChange} />
          </FormField>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang tính...' : 'Tính toán'}
          </button>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="Kết quả">
              <ResultRow label="Tổng tiền cuối kỳ"    value={formatVND(result.finalAmount)}     highlight />
              <ResultRow label="Tổng vốn đã góp"      value={formatVND(result.totalContributed)} />
              <ResultRow label="Tổng lãi kiếm được"   value={formatVND(result.totalInterest)}   />
              <ResultRow label="Lãi suất hiệu quả (EAR)" value={formatPercent(result.effectiveRate)} />
            </ResultCard>

            <ResultCard title="Biểu đồ tăng trưởng">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={result.yearlyBreakdowns} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(0)}tr`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatVND(v)} labelFormatter={(l) => `Năm ${l}`} />
                  <Legend />
                  <Area type="monotone" dataKey="totalContributed" stackId="1" name="Vốn góp" stroke="#93c5fd" fill="#dbeafe" />
                  <Area type="monotone" dataKey="balance" stackId="2" name="Tổng tài sản" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  )
}
