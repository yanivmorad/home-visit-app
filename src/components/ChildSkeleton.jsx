export default function ChildDetailsSkeleton() {
  return (
    <div dir="rtl" className="space-y-6 text-right">
      <div className="p-6 max-w-4xl mx-auto space-y-6 animate-pulse">
        {/* Header */}
        <div className="h-6 bg-gray-300 rounded w-1/3" />

        {/* Child Box */}
        <div className="bg-gray-100 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-40" />
              <div className="h-4 bg-gray-300 rounded w-28" />
            </div>
            <div className="h-10 w-20 bg-red-400 rounded" />
          </div>
        </div>

        {/* פגישות */}
        <div>
          <div className="h-5 bg-gray-300 rounded w-32 mb-3" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
            ))}
          </div>
        </div>

        {/* Add new meeting */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-40" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-blue-300 rounded w-32" />
        </div>
      </div>
    </div>
  );
}
