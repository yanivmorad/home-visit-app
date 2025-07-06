// src/scr/hooks/useChildren.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchChildren,
  fetchChild,
  createChild,
  replaceChild,
  patchChild,
  deleteChild,
} from "../api/childrenApi";

export function useChildren() {
  return useQuery({
    queryKey: ["children"],
    queryFn: fetchChildren,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useChild(id) {
  return useQuery({
    queryKey: ["child", id],
    queryFn: () => fetchChild(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // נניח שחמש דקות מספיקות
    refetchOnWindowFocus: false,
  });
}

export function useCreateChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createChild,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["children"] });
    },
  });
}

export function useUpdateChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => replaceChild(id, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["children"] });
      qc.invalidateQueries({ queryKey: ["child", vars.id] });
    },
  });
}

export function usePatchChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => patchChild(id, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["children"] });
      qc.invalidateQueries({ queryKey: ["child", vars.id] });
    },
  });
}

export function useDeleteChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteChild(id),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["children"] });
      qc.invalidateQueries({ queryKey: ["child", vars.id] });
    },
  });
}
