export default function ChildPhonesList({
  phones = [],
  displayed = [],
  showAll,
  setShowAll,
}) {
  if (phones.length === 0) return null;

  return (
    <div className="flex-1 space-y-1">
      <h3 className="text-lg font-medium text-[#1F3A93]">טלפונים</h3>
      <ul className="space-y-1">
        {displayed.map((p, i) => (
          <li key={i} className="flex items-center text-gray-700">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .6 2.57 2 2 0 0 1-.45 2L9 10a16 16 0 0 0 6 6l.71-.71a2 2 0 0 1 2-.45 12.05 12.05 0 0 0 2.57.6A2 2 0 0 1 22 16.92z" />
            </svg>

            <span className="font-medium text-gray-600 ml-1">{p.label}:</span>
            <span className="ml-1">{p.number}</span>
          </li>
        ))}
      </ul>

      {phones.length > 2 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-sm text-[#1F3A93] hover:text-[#162D6F] transition"
        >
          {showAll ? "הסתר עוד" : `+${phones.length - 2} נוספים`}
        </button>
      )}
    </div>
  );
}
