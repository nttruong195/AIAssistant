import { useState } from 'react'
import { calcSalary } from '../api/calculatorApi'
import { parseNumber } from '../utils/format'

const INITIAL_FORM = {
  grossSalary:  '30,000,000',
  dependents:   '0',
  otherIncome:  '0',
  hasInsurance: true,
}

export function useSalary() {
  const [form, setForm]       = useState(INITIAL_FORM)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [e.target.name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await calcSalary({
        grossSalary:  parseNumber(form.grossSalary),
        dependents:   parseInt(form.dependents),
        otherIncome:  parseNumber(form.otherIncome) || 0,
        hasInsurance: form.hasInsurance,
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
