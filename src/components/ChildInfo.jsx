// src/components/ChildInfo.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteChild } from "../hooks/useChildren";
import { getAgeFromDate } from "../utils/date";
import ChildPhonesList from "./ChildPhonesList";
import ChildActionMenu from "./ChildActionMenu";

export default function ChildInfo({ child, onDelete }) {
  const navigate = useNavigate();

  const age = useMemo(() => getAgeFromDate(child.birthDate), [child.birthDate]);
  const phones = child.phoneNumbers || [];

  const [showAllPhones, setShowAllPhones] = useState(false);
  const displayedPhones = showAllPhones ? phones : phones.slice(0, 2);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const deleteMutation = useDeleteChild();
  const handleConfirmDelete = () => {
    deleteMutation.mutate(
      { id: child.id },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          onDelete?.(child.id);
          navigate("/");
        },
        onError: (err) => console.error("שגיאה במחיקה:", err),
      }
    );
  };

  return (
    <>
      <section
        dir="rtl"
        className="relative bg-white shadow-lg rounded-lg p-4 md:p-6 flex flex-col md:flex-row md:divide-x md:divide-gray-200 gap-4"
      >
        {/* 🌟 Absolute-positioned “More” menu */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
          <ChildActionMenu
            child={child}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            onDeleteRequest={() => setIsConfirmOpen(true)}
          />
        </div>

        {/* מידע אישי */}
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold text-[#1F3A93] flex items-center gap-2">
            <span>{child.name}</span>
            {age != null && (
              <span className="text-gray-400 text-base font-normal">
                ({age})
              </span>
            )}
          </h2>

          {child.category && (
            <p className="text-gray-400 text-xs">סטטוס : {child.category}</p>
          )}

          <div className="flex items-center text-gray-500 text-sm">
            <svg
              aria-hidden="true"
              className="h-4 w-4 ml-2 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6z" />
            </svg>
            <p>
              {child.address}, {child.city}
            </p>
          </div>
        </div>

        {/* טלפונים */}
        <ChildPhonesList
          phones={phones}
          displayed={displayedPhones}
          showAll={showAllPhones}
          setShowAll={setShowAllPhones}
        />

        {/* פעולות דסקטופ (edit & delete buttons) */}
        <div className="hidden md:flex flex-col justify-center gap-2 pl-4">
          <Link
            to={`/edit-child/${child.id}`}
            state={{ child }}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            ערוך
          </Link>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            מחק ילד
          </button>
        </div>
      </section>

      {/* פופאפ אישור מחיקה */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">אישור מחיקה</h3>

            {deleteMutation.isLoading ? (
              <div className="flex items-center justify-center space-x-2 py-4">
                <svg
                  className="animate-spin h-5 w-5 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span className="text-gray-700">מחיקה...</span>
              </div>
            ) : (
              <>
                <p className="text-gray-600">
                  האם אתה בטוח שברצונך למחוק את&nbsp;
                  <span className="font-medium text-gray-800">
                    {child.name}
                  </span>
                  ?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    ביטול
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    מחק
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
