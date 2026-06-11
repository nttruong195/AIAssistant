import { useState } from 'react'
import { calcHomeLoan, calcCarLoan } from '../api/calculatorApi'
import { parseNumber } from '../utils/format'

const getInitialForm = (type) => ({
  loanAmount:  type === 'home' ? '2,000,000,000' : '500,000,000',
  annualRate:  type === 'home' ? '9'             : '8.5',
  termMonths:  type === 'home' ? '240'           : '60',
  downPayment: type === 'home' ? '500,000,000'   : '100,000,000',
  loanType:    'FIXED',
})

export function useLoan(type) {
  const [form, setForm]       = useState(getInitialForm(type))
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const apiCall = type === 'home' ? calcHomeLoan : calcCarLoan
      const { data } = await apiCall({
        loanAmount:  parseNumber(form.loanAmount),
        annualRate:  parseFloat(form.annualRate),
        termMonths:  parseInt(form.termMonths),
        downPayment: parseNumber(form.downPayment) || 0,
        loanType:    form.loanType,
      })
      setResult(data)
    } catch {
      setError('Có lỗi xảy ra. Vui lòng kiểm tra lại.')
    } finally {
      setLoading(false)
    }
  }

  return { form, result, loading, error, handleChange, handleSubmit }
}
