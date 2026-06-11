export default function ResultRow({ label, value, highlight = false, indent = false }) {
  return (
    <div className={`result-row ${indent ? 'pl-4' : ''}`}>
      <span className={`text-sm ${indent ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
      <span className={
        highlight
          ? 'highlight-value'
          : indent
            ? 'text-sm font-medium text-gray-500'
            : 'text-sm font-semibold text-gray-800'
      }>
        {value}
      </span>
    </div>
  )
}
