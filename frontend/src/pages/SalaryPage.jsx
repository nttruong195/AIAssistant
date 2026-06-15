import SEO from '../components/ui/SEO'
import { useSalary } from '../hooks/useSalary'
import { TAX_BRACKETS, PIE_COLORS } from '../constants'
import { formatVND } from '../utils/format'
import FormField from '../components/ui/FormField'
import NumberInput from '../components/ui/NumberInput'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function SalaryPage() {
  const { form, result, loading, error, handleChange, handleSubmit } = useSalary()

  const pieData = result ? [
    { name: 'Lương Net',  value: result.netSalary      },
    { name: 'Bảo hiểm',  value: result.totalInsurance  },
    { name: 'Thuế TNCN', value: result.pitTax           },
  ] : []

  const bracketValues = result ? [
    result.taxBreakdown.bracket1, result.taxBreakdown.bracket2, result.taxBreakdown.bracket3,
    result.taxBreakdown.bracket4, result.taxBreakdown.bracket5, result.taxBreakdown.bracket6,
    result.taxBreakdown.bracket7,
  ] : []

  return (
    <div className="page-container">
      <SEO title="Tính lương Gross Net & thuế TNCN" description="Tính lương net từ gross, thuế TNCN theo bậc lũy tiến Việt Nam 2024." path="/salary" />
      <h1 className="page-title">💰 Gross → Net & Thuế TNCN</h1>
      <p className="page-subtitle">Tính lương thực nhận theo quy định Việt Nam 2024</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Lương Gross (VNĐ/tháng)">
            <NumberInput name="grossSalary" value={form.grossSalary} onChange={handleChange} required />
          </FormField>
          <FormField label="Số người phụ thuộc" hint="Giảm trừ 4.4 triệu/người/tháng">
            <input name="dependents" value={form.dependents} onChange={handleChange}
              type="number" min="0" max="10" className="input-field" />
          </FormField>
          <FormField label="Thu nhập khác chịu thuế (VNĐ/tháng)">
            <NumberInput name="otherIncome" value={form.otherIncome} onChange={handleChange} placeholder="Thưởng, phụ cấp..." />
          </FormField>
          <div className="flex items-center gap-3">
            <input name="hasInsurance" checked={form.hasInsurance} onChange={handleChange}
              type="checkbox" id="hasInsurance" className="w-4 h-4 accent-blue-600" />
            <label htmlFor="hasInsurance" className="text-sm text-gray-700">
              Đóng BHXH / BHYT / BHTN
            </label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang tính...' : 'Tính toán'}
          </button>

          {/* Bảng tham chiếu */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2">Bảng lũy tiến thuế TNCN 2024</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left py-0.5">Thu nhập/tháng</th>
                  <th className="text-right py-0.5">Thuế suất</th>
                </tr>
              </thead>
              <tbody>
                {TAX_BRACKETS.map((b, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-0.5 text-gray-600">{b.range}</td>
                    <td className="text-right font-semibold text-blue-600">{b.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>

        {result && (
          <div className="space-y-4">
            <ResultCard title="Kết quả">
              <ResultRow label="Lương Gross"           value={formatVND(result.grossSalary)}     />
              <ResultRow label="BHXH (8%)"             value={`- ${formatVND(result.bhxh)}`}     indent />
              <ResultRow label="BHYT (1.5%)"           value={`- ${formatVND(result.bhyt)}`}     indent />
              <ResultRow label="BHTN (1%)"             value={`- ${formatVND(result.bhtn)}`}     indent />
              <ResultRow label="Thu nhập tính thuế"    value={formatVND(result.taxableIncome)}   />
              <ResultRow label="Giảm trừ bản thân"     value={`- ${formatVND(result.personalDeduction)}`} indent />
              <ResultRow label="Giảm trừ phụ thuộc"   value={result.dependentDeduction > 0 ? `- ${formatVND(result.dependentDeduction)}` : '—'} indent />
              <ResultRow label="Thu nhập chịu thuế"    value={formatVND(result.taxBase)}         />
              <ResultRow label="Thuế TNCN"             value={`- ${formatVND(result.pitTax)}`}   />
              <div className="mt-2 pt-2 border-t-2 border-blue-100">
                <ResultRow label="Lương Net thực nhận" value={formatVND(result.netSalary)}       highlight />
              </div>
            </ResultCard>

            <ResultCard title="Cơ cấu lương Gross">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatVND(v)} />
                </PieChart>
              </ResponsiveContainer>
            </ResultCard>

            {result.pitTax > 0 && (
              <ResultCard title="Chi tiết từng bậc thuế">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b">
                      <th className="text-left py-1">Bậc</th>
                      <th className="text-right py-1">Thuế suất</th>
                      <th className="text-right py-1">Tiền thuế</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TAX_BRACKETS.map((b, i) => bracketValues[i] > 0 && (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1 text-gray-600">{b.range}</td>
                        <td className="text-right text-gray-500">{b.rate}</td>
                        <td className="text-right font-semibold text-red-500">{formatVND(bracketValues[i])}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td className="pt-2" colSpan={2}>Tổng thuế TNCN</td>
                      <td className="pt-2 text-right text-red-600">{formatVND(result.pitTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </ResultCard>
            )}
          </div>
        )}
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Gross và Net là gì?</h2>
          <p>Lương Gross là lương trước khấu trừ. Lương Net là số tiền thực nhận sau khi trừ bảo hiểm xã hội (8%), bảo hiểm y tế (1.5%), bảo hiểm thất nghiệp (1%) và thuế thu nhập cá nhân (TNCN) theo biểu lũy tiến 7 bậc.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Biểu thuế TNCN 2024</h2>
          <p>Thuế TNCN áp dụng theo 7 bậc lũy tiến: 5% cho thu nhập chịu thuế đến 5 triệu/tháng, 10% từ 5–10 triệu, 15% từ 10–18 triệu, 20% từ 18–32 triệu, 25% từ 32–52 triệu, 30% từ 52–80 triệu, 35% trên 80 triệu. Giảm trừ gia cảnh bản thân 11 triệu/tháng, người phụ thuộc 4.4 triệu/tháng.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Giảm trừ gia cảnh là gì?</h3><p className="mt-1">Khoản được trừ khỏi thu nhập trước khi tính thuế. Bản thân 11 triệu/tháng, mỗi người phụ thuộc 4.4 triệu/tháng.</p></div>
            <div><h3 className="font-medium text-gray-700">BHXH có bắt buộc không?</h3><p className="mt-1">Có. Người lao động đóng 8% BHXH, 1.5% BHYT, 1% BHTN. Chủ lao động đóng thêm phần của họ.</p></div>
            <div><h3 className="font-medium text-gray-700">Lương Net tối thiểu là bao nhiêu?</h3><p className="mt-1">Lương tối thiểu vùng năm 2024: Vùng I (Hà Nội, TP.HCM) là 4.96 triệu/tháng.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
