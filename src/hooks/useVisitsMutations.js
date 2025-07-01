// src/hooks/useVisitsMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addVisit, updateVisit } from "../api/childrenApi";

export function useAddVisit() {
  const qc = useQueryClient();
  return useMutation(({ childId, visit }) => addVisit(childId, visit), {
    onSuccess: (newVisit, vars) => {
      // לרענן רק את הילד הספציפי
      qc.invalidateQueries(["child", vars.childId]);
    },
  });
}

export function useUpdateVisit() {
  const qc = useQueryClient();
  return useMutation(
    ({ childId, visitId, notes }) => updateVisit(childId, visitId, notes),
    {
      onSuccess: (_data, vars) => {
        qc.invalidateQueries(["child", vars.childId]);
      },
    }
  );
}
