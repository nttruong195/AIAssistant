/**
 * Format số thành tiền VNĐ
 */
export const formatVND = (value) => {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format số thành % với 2 chữ số thập phân
 */
export const formatPercent = (value) => {
  if (value === null || value === undefined) return '—'
  return `${Number(value).toFixed(2)}%`
}

/**
 * Parse chuỗi nhập liệu thành số (xử lý dấu phẩy, chấm)
 */
export const parseNumber = (str) => {
  if (!str) return 0
  return parseFloat(String(str).replace(/,/g, '')) || 0
}

/**
 * Format số nguyên với dấu phẩy ngăn cách hàng nghìn
 * Dùng cho input fields: 1000000 → "1,000,000"
 */
export const formatNumberInput = (value) => {
  if (value === '' || value === null || value === undefined) return ''
  const num = String(value).replace(/,/g, '')
  if (isNaN(num) || num === '') return ''
  return Number(num).toLocaleString('en-US')
}
