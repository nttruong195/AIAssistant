import { Link, useLocation, NavLink } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

const CALC_ITEMS = [
  { path: '/',             label: 'Lãi kép',          icon: '📈', desc: 'Tính lãi kép theo thời gian' },
  { path: '/home-loan',    label: 'Vay nhà',           icon: '🏠', desc: 'Tính trả góp mua nhà' },
  { path: '/car-loan',     label: 'Vay xe',            icon: '🚗', desc: 'Tính trả góp mua xe' },
  { path: '/salary',       label: 'Gross → Net',       icon: '💰', desc: 'Thuế TNCN & lương thực nhận' },
  { path: '/savings',      label: 'Tiết kiệm',         icon: '🏦', desc: 'Lãi suất tiết kiệm ngân hàng' },
  { path: '/goal-planner', label: 'Mục tiêu tài chính',icon: '🎯', desc: 'Cần tiết kiệm bao nhiêu/tháng' },
  { path: '/rent-vs-buy',  label: 'Thuê vs Mua nhà',   icon: '🏘️', desc: 'Nên thuê hay mua nhà?' },
  { path: '/roi',          label: 'ROI đầu tư',        icon: '📊', desc: 'Tỷ suất sinh lời' },
  { path: '/insurance',    label: 'Bảo hiểm nhân thọ', icon: '🛡️', desc: 'Ước tính phí bảo hiểm' },
  { path: '/budget',       label: 'Ngân sách 50/30/20',icon: '💼', desc: 'Phân bổ thu nhập hợp lý' },
]

const AI_ITEMS = [
  { path: '/cv-analyzer',   label: 'Phân tích CV',  icon: '📄', desc: 'Đánh giá điểm mạnh/yếu' },
  { path: '/cover-letter',  label: 'Thư xin việc',  icon: '✉️',  desc: 'Viết cover letter chuyên nghiệp' },
  { path: '/email',         label: 'Viết Email',    icon: '📧', desc: 'Email công sở chuyên nghiệp' },
  { path: '/jd',            label: 'Tạo JD',        icon: '📋', desc: 'Job description hoàn chỉnh' },
]

function Dropdown({ label, items, pathname }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const isActive = items.some(i => i.path === pathname)

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
          isActive || open
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-1.5 z-50">
          {items.map(({ path, label, icon, desc }) => (
            <Link key={path} to={path}
              onClick={() => setOpen(false)}
              className={`flex items-start gap-3 px-4 py-2.5 transition-colors ${
                pathname === path
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg leading-none mt-0.5">{icon}</span>
              <div>
                <p className={`text-sm font-medium leading-tight ${pathname === path ? 'text-blue-700' : ''}`}>
                  {label}
                </p>
                {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
              </div>
              {pathname === path && (
                <span className="ml-auto text-blue-500 text-xs mt-0.5">●</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">
              Career<span className="text-blue-600">AI</span>
            </span>
          </Link>

          <div className="w-px h-5 bg-gray-200 mr-1" />

          <Dropdown label="Tài chính" items={CALC_ITEMS} pathname={pathname} />
          <Dropdown label="Hỗ trợ AI" items={AI_ITEMS} pathname={pathname} />

          <div className="ml-auto flex items-center gap-1">
            <Link to="/shop"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === '/shop'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}>
              🏪 Shop Agent
            </Link>
            <Link to="/contact"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === '/contact'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}>
              💬 Góp ý
            </Link>
          </div>


        </div>
      </div>
    </nav>
  )
}
