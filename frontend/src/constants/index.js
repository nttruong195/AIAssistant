export const COMPOUND_FREQUENCY_OPTIONS = [
  { value: 1,   label: 'Hàng năm' },
  { value: 2,   label: 'Nửa năm' },
  { value: 4,   label: 'Hàng quý' },
  { value: 12,  label: 'Hàng tháng' },
  { value: 365, label: 'Hàng ngày' },
]

export const LOAN_TYPE_OPTIONS = [
  { value: 'FIXED',     label: 'Trả đều (annuity) — phổ biến' },
  { value: 'DECLINING', label: 'Dư nợ giảm dần' },
]

export const TAX_BRACKETS = [
  { range: 'Đến 5 triệu',    rate: '5%'  },
  { range: '5 – 10 triệu',   rate: '10%' },
  { range: '10 – 18 triệu',  rate: '15%' },
  { range: '18 – 32 triệu',  rate: '20%' },
  { range: '32 – 52 triệu',  rate: '25%' },
  { range: '52 – 80 triệu',  rate: '30%' },
  { range: 'Trên 80 triệu',  rate: '35%' },
]

export const PIE_COLORS = ['#3b82f6', '#f97316', '#ef4444']
