import React, { useState } from "react";
import { useUpdateMeeting, useDeleteMeeting } from "../hooks/useMeetings";

// פשוט חיתוך טקסט
const snippet = (text = "", max = 50) =>
  typeof text === "string" && text.length > max
    ? text.slice(0, max) + "…"
    : text;

export default function MeetingItem({ meeting, childId }) {
  const updateM = useUpdateMeeting(childId);
  const deleteM = useDeleteMeeting(childId);

  // מצב פתיחה / סגירה של details
  const [expanded, setExpanded] = useState(false);
  // מצב עריכה
  const [editMode, setEditMode] = useState(false);

  // שדות לעריכה
  const [date, setDate] = useState(meeting.date);
  const [summary, setSummary] = useState(meeting.summary);

  const onSave = () => {
    updateM.mutate({
      meetingId: meeting.id,
      meeting: { date, summary },
    });
    setEditMode(false);
  };

  const onDelete = () => {
    deleteM.mutate(meeting.id);
  };

  return (
    <details
      className="bg-white p-4 rounded shadow hover:bg-gray-50 transition"
      open={expanded}
      onToggle={(e) => setExpanded(e.target.open)}
      dir="rtl"
    >
      <summary className="cursor-pointer font-medium text-right">
        📅 {meeting.date} — {snippet(meeting.summary)}
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
                שמור
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-neutral-700">{meeting.summary}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-600 hover:underline"
              >
                ערוך
              </button>
              <button
                onClick={onDelete}
                disabled={deleteM.isLoading}
                className="text-red-600 hover:underline disabled:opacity-50"
              >
                מחק
              </button>
            </div>
          </>
        )}
      </div>
    </details>
  );
}
