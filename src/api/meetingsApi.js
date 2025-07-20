//src/api/meetingsApi.js

import { clientFetch } from "./client";

// const BASE = "http://localhost:4000/api/meetings";
const BASE = "https://home-visit-backend.onrender.com/api/meetings";

export async function fetchMeetingsByChild(childId) {
  return await clientFetch(`${BASE}/child/${childId}`);
}

export async function createMeeting(childId, meeting) {
  const payload = { childId, ...meeting };
  return await clientFetch(BASE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMeeting(meetingId, meeting) {
  return await clientFetch(`${BASE}/${meetingId}`, {
    method: "PUT",
    body: JSON.stringify(meeting),
  });
}

export async function deleteMeeting(meetingId) {
  return await clientFetch(`${BASE}/${meetingId}`, {
    method: "DELETE",
  });
}
