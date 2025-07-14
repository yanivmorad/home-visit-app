import React from "react";

export default function ChildrenSkeletonGrid() {
  return (
    <div className="space-y-6 mt-4">
      {/* חיפוש */}
      <div className="animate-pulse flex gap-4">
        <div className="h-10 w-2/3 bg-gray-300 rounded" /> {/* שדה חיפוש */}
        <div className="h-10 w-1/6 bg-gray-300 rounded" /> {/* כפתור 1 */}
        <div className="h-10 w-1/6 bg-gray-300 rounded" /> {/* כפתור 2 */}
      </div>

      {/* הגריד של הכרטיסים */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="
              animate-pulse
              rounded-lg border border-gray-200 bg-gray-100 p-4 space-y-4
            "
          >
            <div className="h-4 w-1/3 bg-gray-300 rounded" />
            <div className="h-4 w-1/2 bg-gray-300 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
