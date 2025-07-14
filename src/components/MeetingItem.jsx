// src/components/MeetingItem.jsx
import React, { useState, useEffect } from "react";
import { useUpdateMeeting, useDeleteMeeting } from "../hooks/useMeetings";
import { formatDate } from "../utils/date";
import { useQueryClient } from "@tanstack/react-query";

// חיתוך טקסט לסניפט
const snippet = (text = "", max = 20) =>
  typeof text === "string" && text.length > max
    ? text.slice(0, max) + "…"
    : text;

export default function MeetingItem({ meeting, childId }) {
  const queryClient = useQueryClient();
  const updateM = useUpdateMeeting(childId);
  const deleteM = useDeleteMeeting(childId);

  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // local state for date & summary
  const [date, setDate] = useState(meeting.date);
  const [summary, setSummary] = useState(meeting.summary);

  // לחיתוך לפי שורות מה-state
  const allLines = summary.split("\n");
  const CHUNK = 4;
  const [chunks, setChunks] = useState(1);

  // איפוס חיתוך כשמתחילים עריכה או props משתנים
  useEffect(() => {
    setChunks(1);
  }, [summary, editMode]);

  // sync מקומי עם props חיצוני
  useEffect(() => {
    setDate(meeting.date);
    setSummary(meeting.summary);
  }, [meeting.date, meeting.summary]);

  // שמירה עם עדכון רשימת הפגישות
  const onSave = () => {
    updateM.mutate(
      { meetingId: meeting.id, meeting: { date, summary } },
      {
        onSuccess: () => {
          // רענון cache כדי להראות את ה-summary החדש בכל מקום
          queryClient.invalidateQueries(["meetings", childId]);
          setEditMode(false);
        },
        onError: (err) => console.error("🔴 updateMeeting error", err),
      }
    );
  };

  // מחיקה עם אישור
  const onConfirmDelete = () => {
    deleteM.mutate(meeting.id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["meetings", childId]);
        setShowDeleteConfirm(false);
        setExpanded(false);
      },
      onError: (err) => console.error("🔴 deleteMeeting error", err),
    });
  };

  const visibleLines = allLines.slice(0, chunks * CHUNK);
  const hasMore = allLines.length > chunks * CHUNK;

  return (
    <>
      <details
        className="bg-white p-4 rounded-xl shadow hover:bg-gray-50 transition"
        dir="rtl"
        open={expanded}
        onToggle={(e) => setExpanded(e.target.open)}
      >
        <summary className="cursor-pointer font-medium text-right text-gray-700">
          📅 {formatDate(date)} — {snippet(summary)}
        </summary>

        <div className="mt-2 space-y-2 text-right">
          {editMode ? (
            <>
              <input
                type="date"
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <textarea
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1F3A93] focus:border-[#1F3A93] transition"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    // ביטול: מחזירים לערכי props המקוריים
                    setDate(meeting.date);
                    setSummary(meeting.summary);
                    setEditMode(false);
                  }}
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >
                  ביטול
                </button>
                <button
                  onClick={onSave}
                  disabled={updateM.isLoading}
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateM.isLoading ? "שומר…" : "שמור"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-neutral-700 leading-relaxed whitespace-pre-line space-y-2">
                {visibleLines.join("\n")}
              </div>

              {hasMore && (
                <button
                  onClick={() => setChunks((prev) => prev + 1)}
                  className="mt-2 text-[#1F3A93] hover:text-[#162D6F] transition"
                >
                  קרא עוד
                </button>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditMode(true)}
                  className="text-[#1F3A93] hover:text-[#162D6F] transition"
                >
                  ערוך
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteM.isLoading}
                  className="text-red-600 hover:text-red-700 transition disabled:opacity-50"
                >
                  {deleteM.isLoading ? "מוחק…" : "מחק"}
                </button>
              </div>
            </>
          )}
        </div>
      </details>

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              מחיקת פגישה
            </h2>
            <p className="text-gray-600 mb-6">
              האם אתה בטוח שברצונך למחוק את הפגישה מ־{formatDate(date)}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                ביטול
              </button>
              <button
                onClick={onConfirmDelete}
                className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
