import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { useAi } from '../hooks/useAi'
import AiOutputBox from '../components/ui/AiOutputBox'

export default function LinkedInPage() {
  const [profileText, setProfileText] = useState('')
  const { output, loading, error, submit, reset } = useAi('/api/v1/ai/linkedin')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!profileText.trim()) return
    reset()
    submit({ profileText })
  }

  return (
    <div className="page-container">
      <SEO title="Tối ưu LinkedIn bằng AI" description="AI tối ưu LinkedIn profile để thu hút nhà tuyển dụng và tăng cơ hội việc làm." path="/linkedin" />
      <h1 className="page-title">💼 LinkedIn Optimizer</h1>
      <p className="page-subtitle">Paste nội dung LinkedIn profile — AI phân tích và gợi ý cải thiện từng section</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nội dung LinkedIn profile <span className="text-red-400">*</span>
            </label>
            <textarea value={profileText} onChange={e => setProfileText(e.target.value)}
              placeholder={`Dán nội dung profile LinkedIn của bạn vào đây...\n\nVí dụ:\nHeadline: Senior Java Developer\nAbout: ...\nKinh nghiệm: ...\nKỹ năng: ...`}
              rows={12} disabled={loading}
              className="input-field resize-y" />
          </div>
          <button type="submit" disabled={loading || !profileText.trim()} className="btn-primary">
            {loading ? 'Đang phân tích...' : '✨ Tối ưu LinkedIn'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">💼</p>
              <p className="text-sm">Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
