// src/hooks/useChild.js
import { useQuery } from "@tanstack/react-query";
import { fetchChild } from "../api/childrenApi";

export function useChild(id) {
  return useQuery({
    queryKey: ["child", id],
    queryFn: () => fetchChild(id),
    enabled: Boolean(id),
  });
}
