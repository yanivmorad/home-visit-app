// +// File: homeVisit/src/api/meetingsApi.js

// const BASE = "http://localhost:4000/api/meetings";
const BASE = "https://home-visit-backend.onrender.com/api/meetings";

export async function fetchMeetingsByChild(childId) {
  const res = await fetch(`${BASE}/child/${childId}`);
  if (!res.ok) throw new Error("Error fetching meetings");
  return res.json();
}

export async function createMeeting(childId, meeting) {
  const payload = { childId, ...meeting };
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error adding meeting");
  return res.json();
}

export async function updateMeeting(meetingId, meeting) {
  const res = await fetch(`${BASE}/${meetingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meeting),
  });
  if (!res.ok) throw new Error("Error updating meeting");
  return res.json();
}

export async function deleteMeeting(meetingId) {
  const res = await fetch(`${BASE}/${meetingId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error deleting meeting");
  return res.json();
}
