// src/components/MeetingItem.jsx
import React, { useState, useEffect } from "react";
import { useUpdateMeeting, useDeleteMeeting } from "../hooks/useMeetings";
import { formatDate } from "../hooks/date";
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

  const [date, setDate] = useState(meeting.date);
  const [summary, setSummary] = useState(meeting.summary);

  // לחיתוך לפי שורות
  const allLines = meeting.summary.split("\n");
  const CHUNK = 4;
  const [chunks, setChunks] = useState(1);

  // כשעוברים לעריכה או מתעדכנים props
  useEffect(() => {
    setChunks(1);
  }, [meeting.summary, editMode]);

  // כמה שורות להראות כרגע
  const visibleLines = allLines.slice(0, chunks * CHUNK);
  const hasMore = allLines.length > chunks * CHUNK;
  // סנכרון שדות מקומיים עם props שמתעדכנים
  useEffect(() => {
    setDate(meeting.date);
    setSummary(meeting.summary);
  }, [meeting.date, meeting.summary]);

  // שמירה עם עדכון מיידי
  const onSave = () => {
    // Optimistic UI: values already in state
    updateM.mutate(
      { meetingId: meeting.id, meeting: { date, summary } },
      {
        onSuccess: () => {
          setEditMode(false);
        },
        onError: (err) => console.error("🔴 updateMeeting error", err),
      }
    );
  };

  const onConfirmDelete = () => {
    deleteM.mutate(meeting.id, {
      onSuccess: () => {
        // מרעננים את קווריז "meetings" עבור childId הזה
        queryClient.invalidateQueries(["meetings", childId]);

        // סוגרים מודאל ומקטינים חזרה
        setShowDeleteConfirm(false);
        setExpanded(false);
      },
      onError: (err) => console.error("🔴 deleteMeeting error", err),
    });
  };

  return (
    <>
      <details
        className="bg-white p-4 rounded shadow hover:bg-gray-50 transition"
        dir="rtl"
        open={expanded}
        onToggle={(e) => setExpanded(e.target.open)}
      >
        <summary className="cursor-pointer font-medium text-right">
          📅 {formatDate(date)} — {snippet(summary)}
        </summary>

        <div className="mt-2 space-y-2 text-right">
          {editMode ? (
            <>
              <input
                type="date"
                className="border rounded p-2 w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <textarea
                className="border rounded p-2 w-full"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  ביטול
                </button>
                <button
                  onClick={onSave}
                  disabled={updateM.isLoading}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {updateM.isLoading ? "שומר…" : "שמור"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className="
    text-neutral-700
    leading-relaxed        /* מרווח בין שורות */
    whitespace-pre-line    /* מפרש '\n' כהפסקת שורה */
    space-y-2              /* ריווח בין פסקאות */
  "
              >
                {visibleLines.join("\n")}
              </div>
              {/* כפתור קרא עוד רק אם יש עוד שורות */}
              {hasMore && (
                <button
                  onClick={() => setChunks((prev) => prev + 1)}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  קרא עוד
                </button>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditMode(true)}
                  className="text-blue-600 hover:underline"
                >
                  ערוך
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteM.isLoading}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  {deleteM.isLoading ? "מוחק…" : "מחק"}
                </button>
              </div>
            </>
          )}
        </div>
      </details>

      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="
            fixed inset-0
            flex items-center justify-center
            bg-black/10
            backdrop-blur-sm
            p-4 z-50
          "
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">מחיקת פגישה</h2>
            <p className="mb-6">
              האם אתה בטוח שברצונך למחוק את הפגישה מ־{formatDate(date)}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                ביטול
              </button>
              <button
                onClick={onConfirmDelete}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
