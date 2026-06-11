import { useState } from 'react'
import { calcCompoundInterest } from '../api/calculatorApi'
import { parseNumber } from '../utils/format'

const INITIAL_FORM = {
  principal:           '100,000,000',
  annualRate:          '8',
  years:               '10',
  compoundFrequency:   12,
  monthlyContribution: '1,000,000',
}

export function useCompoundInterest() {
  const [form, setForm]       = useState(INITIAL_FORM)
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
      const { data } = await calcCompoundInterest({
        principal:           parseNumber(form.principal),
        annualRate:          parseFloat(form.annualRate),
        years:               parseInt(form.years),
        compoundFrequency:   parseInt(form.compoundFrequency),
        monthlyContribution: parseNumber(form.monthlyContribution) || 0,
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
