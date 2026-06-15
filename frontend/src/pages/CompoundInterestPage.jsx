import SEO from '../components/ui/SEO'
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
      <SEO title="Tính lãi kép" description="Công cụ tính lãi kép online miễn phí. Xem sức mạnh của lãi kép theo thời gian." path="/" />
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
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Lãi kép là gì?</h2>
          <p>Lãi kép (compound interest) là hình thức tính lãi mà tiền lãi được cộng vào vốn gốc sau mỗi kỳ, tạo ra lãi cho cả phần lãi trước đó. Đây là nguyên lý cốt lõi của đầu tư dài hạn và tích lũy tài sản.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Công thức tính lãi kép</h2>
          <p>A = P × (1 + r/n)^(n×t), trong đó P là vốn gốc, r là lãi suất năm, n là số lần ghép lãi trong năm, t là thời gian (năm). Công cụ này tự động tính toán và hiển thị biểu đồ tăng trưởng tài sản theo từng năm.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Lãi kép khác lãi đơn như thế nào?</h3><p className="mt-1">Lãi đơn chỉ tính lãi trên vốn gốc ban đầu. Lãi kép tính lãi cả trên vốn lẫn phần lãi đã tích lũy — hiệu quả hơn rõ rệt sau nhiều năm.</p></div>
            <div><h3 className="font-medium text-gray-700">Tần suất ghép lãi ảnh hưởng thế nào?</h3><p className="mt-1">Ghép lãi càng nhiều lần trong năm (hàng tháng, hàng ngày) thì tổng tiền cuối kỳ càng cao do lãi được tính và cộng dồn thường xuyên hơn.</p></div>
            <div><h3 className="font-medium text-gray-700">Nên đầu tư bao nhiêu mỗi tháng?</h3><p className="mt-1">Theo quy tắc 50/30/20, bạn nên tiết kiệm ít nhất 20% thu nhập mỗi tháng. Kết hợp với lãi kép, ngay cả số tiền nhỏ cũng tích lũy đáng kể sau 10–20 năm.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
