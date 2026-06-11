export default function ResultCard({ title, children, accent }) {
  return (
    <div className="result-card">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {accent && <div className="w-1 h-4 rounded-full bg-blue-500" />}
          <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}
