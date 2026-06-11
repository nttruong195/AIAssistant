import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Gửi thất bại')
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setError('Không gửi được, vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-2xl">
      <h1 className="page-title">💬 Liên hệ & Góp ý</h1>
      <p className="page-subtitle">Có ý kiến, góp ý hoặc phát hiện lỗi? Gửi cho mình nhé!</p>

      {success ? (
        <div className="result-card text-center py-12">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-semibold text-gray-800 text-lg">Đã gửi thành công!</p>
          <p className="text-gray-400 text-sm mt-1">Cảm ơn bạn đã góp ý. Mình sẽ phản hồi sớm nhất có thể.</p>
          <button onClick={() => setSuccess(false)}
            className="mt-6 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            Gửi thêm
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên của bạn <span className="text-red-400">*</span>
              </label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Nguyễn Văn A" required disabled={loading}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="example@gmail.com" required disabled={loading}
                className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tiêu đề <span className="text-red-400">*</span>
            </label>
            <input name="subject" value={form.subject} onChange={handleChange}
              placeholder="Ví dụ: Góp ý tính năng lãi kép" required disabled={loading}
              className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nội dung <span className="text-red-400">*</span>
            </label>
            <textarea name="message" value={form.message} onChange={handleChange}
              placeholder="Mô tả chi tiết ý kiến hoặc lỗi bạn gặp phải..."
              rows={6} required disabled={loading}
              className="input-field resize-y" />
          </div>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1.5">
              <span>⚠️</span> {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang gửi...' : '📨 Gửi góp ý'}
          </button>
        </form>
      )}
    </div>
  )
}
