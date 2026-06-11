import { formatNumberInput } from '../../utils/format'

/**
 * Input số có dấu phẩy ngăn cách hàng nghìn
 * value/onChange dùng chuỗi đã format (ví dụ "1,000,000")
 */
export default function NumberInput({ name, value, onChange, placeholder, min, disabled, required }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/,/g, '')
    if (raw === '' || /^\d*$/.test(raw)) {
      onChange({ target: { name, value: formatNumberInput(raw) } })
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className="input-field"
    />
  )
}
