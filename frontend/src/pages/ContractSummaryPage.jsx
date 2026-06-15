import SEO from '../components/ui/SEO'
import { useState } from 'react'
import { useAi } from '../hooks/useAi'
import AiOutputBox from '../components/ui/AiOutputBox'

export default function ContractSummaryPage() {
  const [contractText, setContractText] = useState('')
  const { output, loading, error, submit, reset } = useAi('/api/v1/ai/contract-summary')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!contractText.trim()) return
    reset()
    submit({ contractText })
  }

  return (
    <div className="page-container">
      <SEO title="Phân tích hợp đồng lao động bằng AI" description="AI tóm tắt và phân tích điều khoản hợp đồng lao động bằng tiếng Việt." path="/contract-summary" />
      <h1 className="page-title">📑 Tóm Tắt Hợp Đồng Lao Động</h1>
      <p className="page-subtitle">Paste nội dung hợp đồng — AI highlight điều khoản quan trọng, rủi ro và so sánh Luật Lao động</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="result-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nội dung hợp đồng lao động <span className="text-red-400">*</span>
            </label>
            <textarea value={contractText} onChange={e => setContractText(e.target.value)}
              placeholder={`Paste nội dung hợp đồng vào đây...\n\nVí dụ: Điều 1: Thời hạn hợp đồng...\nĐiều 2: Lương và phụ cấp...\nĐiều 3: Thời gian thử việc...`}
              rows={14} disabled={loading}
              className="input-field resize-y" />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs text-amber-700">⚠️ Kết quả AI chỉ mang tính tham khảo, không thay thế tư vấn pháp lý chính thức</p>
          </div>
          <button type="submit" disabled={loading || !contractText.trim()} className="btn-primary">
            {loading ? 'Đang phân tích...' : '📑 Phân tích hợp đồng'}
          </button>
        </form>

        <div>
          <AiOutputBox output={output} loading={loading} error={error} />
          {!output && !loading && (
            <div className="result-card text-center py-10 text-gray-300">
              <p className="text-4xl mb-3">📑</p>
              <p className="text-sm">Kết quả sẽ hiển thị ở đây</p>
            </div>
          )}
        </div>
      </div>
      {/* SEO Content */}
      <div className="mt-12 border-t border-gray-100 pt-8 space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Phân tích hợp đồng lao động</h2>
          <p>Hợp đồng lao động là văn bản pháp lý ràng buộc quyền và nghĩa vụ của cả hai bên. AI tóm tắt các điều khoản quan trọng và cảnh báo những điều khoản bất lợi cần chú ý trước khi ký.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            <div><h3 className="font-medium text-gray-700">Cần chú ý điều khoản nào trong HĐLĐ?</h3><p className="mt-1">Thời gian thử việc và lương thử việc, điều khoản cạnh tranh (non-compete), thời hạn báo trước khi nghỉ, quy định thưởng/hoa hồng.</p></div>
            <div><h3 className="font-medium text-gray-700">Hợp đồng thử việc có khác HĐLĐ không?</h3><p className="mt-1">Có. Hợp đồng thử việc tối đa 60 ngày (180 ngày cho công việc quản lý). Lương thử việc tối thiểu 85% lương chính thức.</p></div>
          </div>
        </section>
      </div>
    </div>
  )
}
