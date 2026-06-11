import { useState, useRef, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const QUICK_QUESTIONS = [
  'Hôm nay bán được bao nhiêu?',
  'Sản phẩm nào bán chạy nhất?',
  'Tồn kho hàng nào sắp hết?',
  'Có bao nhiêu đơn chờ xử lý?',
  'Doanh thu tháng này thế nào?',
]

export default function ShopAgentPage() {
  const [shops, setShops]           = useState([])
  const [currentShop, setCurrentShop] = useState(null)
  const [messages, setMessages]     = useState([])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [regForm, setRegForm]       = useState({ ownerEmail: '', shopName: '', platform: 'SHOPEE' })
  const bottomRef = useRef()

  useEffect(() => {
    const email = localStorage.getItem('shopOwnerEmail')
    if (email) loadShops(email)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadShops = async (email) => {
    const res = await fetch(`${API_BASE}/api/v1/shop/list?ownerEmail=${encodeURIComponent(email)}`)
    const data = await res.json()
    setShops(data)
    if (data.length > 0 && !currentShop) selectShop(data[0])
  }

  const selectShop = async (shop) => {
    setCurrentShop(shop)
    setMessages([])
    const res = await fetch(`${API_BASE}/api/v1/shop/${shop.id}/chat`)
    const history = await res.json()
    setMessages(history.map(m => ({
      role: m.role === 'USER' ? 'user' : 'assistant',
      content: m.content
    })))
  }

  const register = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/api/v1/shop/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm),
    })
    const shop = await res.json()
    localStorage.setItem('shopOwnerEmail', regForm.ownerEmail)
    setShops(prev => [...prev, shop])
    setCurrentShop(shop)
    setMessages([])
    setShowRegister(false)
  }

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || !currentShop || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)

    let aiText = ''
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch(`${API_BASE}/api/v1/shop/${currentShop.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      })
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') break
            aiText += data + '\n'
            setMessages(prev => {
              const next = [...prev]
              next[next.length - 1] = { role: 'assistant', content: aiText }
              return next
            })
          }
        }
      }
    } catch {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', content: '⚠️ Lỗi kết nối' }
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  const clearChat = async () => {
    await fetch(`${API_BASE}/api/v1/shop/${currentShop.id}/chat`, { method: 'DELETE' })
    setMessages([])
  }

  const platformBadge = (p) => p === 'SHOPEE'
    ? <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Shopee</span>
    : <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-medium">TikTok</span>

  return (
    <div className="page-container max-w-6xl">
      <h1 className="page-title">🤖 Shop Agent</h1>
      <p className="page-subtitle">Chat với AI để quản lý shop — xem đơn hàng, doanh thu, tồn kho và hơn thế nữa.</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* Sidebar — danh sách shop */}
        <div className="lg:col-span-1 space-y-2">
          <div className="result-card p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="section-label">Shop của bạn</span>
              <button onClick={() => setShowRegister(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Thêm</button>
            </div>

            {shops.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400 text-xs mb-2">Chưa có shop nào</p>
                <button onClick={() => setShowRegister(true)}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">
                  Kết nối shop
                </button>
              </div>
            ) : (
              shops.map(shop => (
                <button key={shop.id} onClick={() => selectShop(shop)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition ${
                    currentShop?.id === shop.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}>
                  <p className="text-sm font-medium text-gray-800 truncate">{shop.shopName}</p>
                  <div className="mt-1">{platformBadge(shop.platform)}</div>
                </button>
              ))
            )}
          </div>

          {/* Quick questions */}
          {currentShop && (
            <div className="result-card p-3">
              <span className="section-label block mb-2">Câu hỏi nhanh</span>
              <div className="space-y-1">
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => sendMessage(q)} disabled={loading}
                    className="w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3 flex flex-col" style={{ height: '70vh' }}>
          {!currentShop ? (
            <div className="result-card flex-1 flex items-center justify-center text-center">
              <div>
                <p className="text-4xl mb-3">🏪</p>
                <p className="text-gray-500 text-sm">Chọn hoặc kết nối shop để bắt đầu chat</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="result-card mb-2 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏪</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{currentShop.shopName}</p>
                    <div>{platformBadge(currentShop.platform)}</div>
                  </div>
                </div>
                <button onClick={clearChat} className="text-xs text-gray-400 hover:text-red-500 transition">
                  Xóa lịch sử
                </button>
              </div>

              {/* Messages */}
              <div className="result-card flex-1 overflow-y-auto mb-2 space-y-3 p-4">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-gray-300">
                    <p className="text-3xl mb-2">💬</p>
                    <p className="text-sm">Hỏi gì đó về shop của bạn...</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                        {msg.content}
                        {msg.role === 'assistant' && loading && i === messages.length - 1 && (
                          <span className="inline-block w-0.5 h-4 bg-gray-500 animate-pulse ml-0.5 align-middle" />
                        )}
                      </pre>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Hỏi về đơn hàng, doanh thu, tồn kho..."
                  disabled={loading}
                  className="input-field flex-1" />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition">
                  Gửi
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal đăng ký shop */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Kết nối Shop</h2>
            <form onSubmit={register} className="space-y-3">
              <input value={regForm.ownerEmail} onChange={e => setRegForm(p => ({...p, ownerEmail: e.target.value}))}
                placeholder="Email của bạn" type="email" required className="input-field" />
              <input value={regForm.shopName} onChange={e => setRegForm(p => ({...p, shopName: e.target.value}))}
                placeholder="Tên shop" required className="input-field" />
              <select value={regForm.platform} onChange={e => setRegForm(p => ({...p, platform: e.target.value}))}
                className="input-field">
                <option value="SHOPEE">Shopee</option>
                <option value="TIKTOK">TikTok Shop</option>
              </select>
              <p className="text-xs text-gray-400">
                ⚠️ Hiện dùng dữ liệu demo. Kết nối thật qua OAuth khi có Partner account.
              </p>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Kết nối</button>
                <button type="button" onClick={() => setShowRegister(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
