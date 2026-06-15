import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { formatVND, parseNumber } from '../utils/format'
import NumberInput from '../components/ui/NumberInput'
import FormField from '../components/ui/FormField'
import ResultCard from '../components/ui/ResultCard'
import ResultRow from '../components/ResultRow'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function RentVsBuyPage() {
  const [form, setForm] = useState({
    housePrice: '3,000,000,000', downPayment: '600,000,000', annualRate: '9',
    termYears: '20', monthlyRent: '12,000,000', annualRentIncrease: '5', annualAppreciation: '7',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/rent-vs-buy`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          housePrice: parseNumber(form.housePrice), downPayment: parseNumber(form.downPayment),
          annualRate: parseFloat(form.annualRate), termYears: parseInt(form.termYears),
          monthlyRent: parseNumber(form.monthlyRent), annualRentIncrease: parseFloat(form.annualRentIncrease),
          annualAppreciation: parseFloat(form.annualAppreciation),
        }),
      })
      setResult(await res.json())
    } finally { setLoading(false) }
  }

  return (
    <div className="page-container">
      <SEO title="Nên thuê hay mua nhà" description="Phân tích tài chính nên thuê hay mua nhà dựa trên thu nhập và giá nhà thực tế." path="/rent-vs-buy" />
      <h1 className="page-title">🏘️ Thuê vs Mua nhà</h1>
      <p className="page-subtitle">Phân tích tài chính: nên thuê hay mua nhà trong hoàn cảnh của bạn?</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Thông tin mua nhà</p>
          <FormField label="Giá nhà (VNĐ)">
            <NumberInput name="housePrice" value={form.housePrice} onChange={handleChange} required />
          </FormField>
          <FormField label="Trả trước (VNĐ)">
            <NumberInput name="downPayment" value={form.downPayment} onChange={handleChange} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Lãi suất vay (%/năm)">
              <input name="annualRate" type="number" value={form.annualRate} onChange={handleChange} step="0.1" className="input-field" />
            </FormField>
            <FormField label="Thời hạn vay (năm)">
              <input name="termYears" type="number" value={form.termYears} onChange={handleChange} className="input-field" />
            </FormField>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Thông tin thuê nhà</p>
            <FormField label="Tiền thuê / tháng (VNĐ)">
              <NumberInput name="monthlyRent" value={form.monthlyRent} onChange={handleChange} />
            </FormField>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <FormField label="Tăng giá thuê (%/năm)">
                <input name="annualRentIncrease" type="number" value={form.annualRentIncrease} onChange={handleChange} step="0.5" className="input-field" />
              </FormField>
              <FormField label="Tăng giá nhà (%/năm)">
                <input name="annualAppreciation" type="number" value={form.annualAppreciation} onChange={handleChange} step="0.5" className="input-field" />
              </FormField>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Đang tính...' : 'Phân tích'}</button>
        </form>

        {result && (
          <div className="space-y-4">
            <div className={`result-card text-center py-4 ${result.recommendation.includes('MUA') ? 'bg-blue-50' : 'bg-amber-50'}`}>
              <p className="text-2xl mb-1">{result.recommendation.includes('MUA') ? '🏠' : '🔑'}</p>
              <p className={`font-bold text-lg ${result.recommendation.includes('MUA') ? 'text-blue-700' : 'text-amber-700'}`}>
                {result.recommendation}
              </p>
            </div>
            <ResultCard title="So sánh chi phí" accent>
              <ResultRow label="Trả góp / tháng"        value={formatVND(result.monthlyMortgage)} />
              <ResultRow label="Tiền thuê / tháng"       value={formatVND(result.monthlyRent)} />
              <ResultRow label="Tổng chi phí MUA"        value={formatVND(result.totalBuyCost)} />
              <ResultRow label="Tổng chi phí THUÊ"       value={formatVND(result.totalRentCost)} />
              <ResultRow label="Vốn chủ sở hữu (mua)"   value={formatVND(result.buyEquity)} highlight />
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  )
}
