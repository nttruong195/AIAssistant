import { useState } from 'react'
import { useAi } from '../hooks/useAi'
import AiOutputBox from '../components/ui/AiOutputBox'

export default function JdPage() {
  const [position, setPosition]         = useState('')
  const [requirements, setRequirements] = useState('')
  const { output, loading, error, submit, reset } = useAi('/api/v1/ai/jd')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!position.trim()) return
    reset()
    submit({ position, requirements })
  }

  return (
    <div className="page-container">
      <h1 className="page-title">📋 Tạo Job Description</h1>
      <p className="page-subtitle">Nhập tên vị trí và yêu cầu cơ bản — AI tạo JD hoàn chỉnh, chuyên nghiệp.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vị trí tuyển dụng <span className="text-red-400">*</span>
            </label>
            <input value={position} onChange={e => setPosition(e.target.value)}
              placeholder="Ví dụ: Senior Java Backend Developer"
              disabled={loading} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Yêu cầu & thông tin thêm
            </label>
            <textarea value={requirements} onChange={e => setRequirements(e.target.value)}
              placeholder="Ví dụ: 3+ năm kinh nghiệm, thành thạo Spring Boot & microservices, lương 25-40tr, làm việc tại Hà Nội, hybrid..."
              rows={8} disabled={loading}
              className="input-field resize-y" />
          </div>
          <button type="submit" disabled={loading || !position.trim()}
            className="btn-primary">
            {loading ? 'Đang tạo...' : '✨ Tạo JD'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm">Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
