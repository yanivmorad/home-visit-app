// src/hooks/useKids.js
import { useQuery } from "@tanstack/react-query";
import { getKids } from "../api/childrenApi";

export function useKids() {
  return useQuery(["kids"], getKids);
}
