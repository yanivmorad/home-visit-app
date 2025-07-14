// src/components/LegalRepSelector.jsx
import React from "react";

export default function LegalRepSelector({ selected, onSelect }) {
  const reps = ["שלמה", "שלומית"];

  return (
    <div className="flex justify-center">
      <div className="inline-flex bg-[#E8EBF0] rounded-2xl p-2 space-x-2 sm:space-x-3">
        {reps.map((rep) => (
          <button
            key={rep}
            onClick={() => onSelect(rep)}
            className={` 
              px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base font-semibold rounded-xl transition
              ${
                selected === rep
                  ? "bg-white text-[#1F3A93] shadow-md ring-2 ring-[#1F3A93]"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            עו"ד {rep}
          </button>
        ))}
      </div>
    </div>
  );
}
