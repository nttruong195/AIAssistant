import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { formatVND, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const COLORS = { needs: '#3b82f6', wants: '#f59e0b', savings: '#22c55e' }

export default function BudgetPage() {
  const [income, setIncome] = useState('30,000,000')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/budget`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyIncome: parseNumber(income) }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }

  const pieData = result ? [
    { name: '50% Nhu cầu thiết yếu', value: result.needs },
    { name: '30% Mong muốn',         value: result.wants },
    { name: '20% Tiết kiệm',         value: result.savings },
  ] : []

  return (
    <div className="page-container">
      <SEO title="Quản lý ngân sách 50/30/20" description="Phân bổ thu nhập theo quy tắc 50/30/20 - nhu cầu thiết yếu, mong muốn, tiết kiệm." path="/budget" />
      <h1 className="page-title">💼 Quản lý ngân sách 50/30/20</h1>
      <p className="page-subtitle">Phân bổ thu nhập theo quy tắc tài chính phổ biến nhất thế giới</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <FormField label="Thu nhập hàng tháng (VNĐ)">
            <NumberInput name="income" value={income} onChange={e => setIncome(e.target.value)} required />
          </FormField>
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-gray-500 space-y-1.5">
            <p><span className="font-semibold text-blue-600">50%</span> — Nhu cầu thiết yếu (nhà, ăn, đi lại)</p>
            <p><span className="font-semibold text-amber-500">30%</span> — Mong muốn (giải trí, mua sắm)</p>
            <p><span className="font-semibold text-green-500">20%</span> — Tiết kiệm & đầu tư</p>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Đang tính...' : 'Phân bổ ngân sách'}</button>
        </form>

        {result && (
          <>
            <div className="result-card">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={Object.values(COLORS)[i]} />)}
                  </Pie>
                  <Tooltip formatter={v => formatVND(v)} />
                  <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {[
                { key: 'needs', label: '🏠 Nhu cầu thiết yếu', amount: result.needs, breakdown: result.needsBreakdown, color: 'blue' },
                { key: 'wants', label: '🎉 Mong muốn', amount: result.wants, breakdown: result.wantsBreakdown, color: 'amber' },
                { key: 'savings', label: '💰 Tiết kiệm', amount: result.savings, breakdown: result.savingsBreakdown, color: 'green' },
              ].map(({ key, label, amount, breakdown, color }) => (
                <ResultCard key={key} title={`${label} — ${formatVND(amount)}`}>
                  {breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between py-1 text-xs border-b border-gray-50 last:border-0">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-700">{formatVND(item.amount)}</span>
                    </div>
                  ))}
                </ResultCard>
              ))}
            </div>
          </>
        )}
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Quy tắc ngân sách 50/30/20</h2>
          <p>Quy tắc 50/30/20 do Elizabeth Warren đề xuất: 50% thu nhập cho nhu cầu thiết yếu (nhà ở, ăn uống, đi lại), 30% cho mong muốn cá nhân (giải trí, mua sắm), 20% cho tiết kiệm và trả nợ. Đây là nguyên tắc đơn giản để quản lý tài chính cá nhân hiệu quả.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Có thể điều chỉnh tỷ lệ không?</h3><p className="mt-1">Có. Nếu sống ở thành phố lớn chi phí cao, có thể dùng 60/20/20. Quan trọng là luôn tiết kiệm tối thiểu 20%.</p></div>
            <div><h3 className="font-medium text-gray-700">Tính trên lương Gross hay Net?</h3><p className="mt-1">Tính trên lương Net — số tiền thực nhận vào tay mỗi tháng.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
