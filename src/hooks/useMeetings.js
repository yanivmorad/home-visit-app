import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMeetingsByChild,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "../api/meetingsApi";

export function useMeetings(childId) {
  return useQuery({
    queryKey: ["meetings", childId],
    queryFn: () => fetchMeetingsByChild(childId),
    enabled: Boolean(childId),
  });
}

export function useAddMeeting(childId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (meeting) => createMeeting(childId, meeting),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meetings", childId] });
    },
  });
}

export function useUpdateMeeting(childId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ meetingId, meeting }) => updateMeeting(meetingId, meeting),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meetings", childId] });
    },
  });
}

export function useDeleteMeeting(childId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (meetingId) => deleteMeeting(meetingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meetings", childId] });
    },
  });
}
