import SEO from '../components/ui/SEO'
import { useLoan } from '../hooks/useLoan'
import { LOAN_TYPE_OPTIONS } from '../constants'
import { formatVND, parseNumber } from '../utils/format'
import FormField from '../components/ui/FormField'
import NumberInput from '../components/ui/NumberInput'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function LoanPage({ type }) {
  const { form, result, loading, error, handleChange, handleSubmit } = useLoan(type)
  const isHome = type === 'home'

  const chartData = result?.schedule?.slice(0, 24).map((m) => ({
    month: `T${m.month}`,
    Gốc: Math.round(m.principal),
    Lãi: Math.round(m.interest),
  }))

  return (
    <div className="page-container">
      <SEO title="Tính vay mua nhà & xe" description="Tính trả góp mua nhà, mua xe. Xem lịch trả nợ chi tiết từng tháng." path="/home-loan" />
      <h1 className="page-title">{isHome ? '🏠 Tính vay mua nhà' : '🚗 Tính vay mua xe'}</h1>
      <p className="page-subtitle">{isHome ? 'Lập kế hoạch tài chính mua nhà' : 'Tính toán chi phí vay mua xe'}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label={`Giá trị ${isHome ? 'căn nhà' : 'chiếc xe'} (VNĐ)`}>
            <NumberInput name="loanAmount" value={form.loanAmount} onChange={handleChange} required />
          </FormField>
          <FormField label="Trả trước (VNĐ)"
            hint={form.loanAmount && form.downPayment
              ? `= ${((parseNumber(form.downPayment) / parseNumber(form.loanAmount)) * 100).toFixed(1)}% giá trị`
              : undefined}>
            <NumberInput name="downPayment" value={form.downPayment} onChange={handleChange} />
          </FormField>
          <FormField label="Lãi suất năm (%)">
            <input name="annualRate" value={form.annualRate} onChange={handleChange}
              type="number" step="0.1" min="0" className="input-field" required />
          </FormField>
          <FormField label="Thời hạn vay">
            <div className="grid grid-cols-2 gap-2">
              <input name="termMonths" value={form.termMonths} onChange={handleChange}
                type="number" min="1" className="input-field" placeholder="Tháng" required />
              <div className="input-field bg-gray-50 flex items-center text-gray-500 text-sm">
                = {Math.round(parseInt(form.termMonths || 0) / 12)} năm
              </div>
            </div>
          </FormField>
          <FormField label="Phương thức trả nợ">
            <select name="loanType" value={form.loanType} onChange={handleChange} className="input-field">
              {LOAN_TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang tính...' : 'Tính toán'}
          </button>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="Kết quả">
              <ResultRow label="Số tiền vay"        value={formatVND(result.loanAmount)}     />
              <ResultRow label="Trả trước"           value={formatVND(result.downPayment)}    />
              <ResultRow label="Trả hàng tháng"     value={formatVND(result.monthlyPayment)} highlight />
              <ResultRow label="Tổng tiền phải trả" value={formatVND(result.totalPayment)}   />
              <ResultRow label="Tổng lãi phải trả"  value={formatVND(result.totalInterest)}  />
            </ResultCard>

            <ResultCard title="Cơ cấu gốc / lãi (24 tháng đầu)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(0)}tr`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => formatVND(v)} />
                  <Legend />
                  <Bar dataKey="Gốc" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Lãi" stackId="a" fill="#fca5a5" />
                </BarChart>
              </ResponsiveContainer>
            </ResultCard>

            <ResultCard title="Bảng phân kỳ (24 tháng đầu)">
              <div className="overflow-auto max-h-64">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-left py-1">Tháng</th>
                      <th className="text-right py-1">Trả tháng</th>
                      <th className="text-right py-1">Gốc</th>
                      <th className="text-right py-1">Lãi</th>
                      <th className="text-right py-1">Dư nợ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((m) => (
                      <tr key={m.month} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-1">{m.month}</td>
                        <td className="text-right">{formatVND(m.payment)}</td>
                        <td className="text-right text-blue-600">{formatVND(m.principal)}</td>
                        <td className="text-right text-red-400">{formatVND(m.interest)}</td>
                        <td className="text-right">{formatVND(m.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  )
}
