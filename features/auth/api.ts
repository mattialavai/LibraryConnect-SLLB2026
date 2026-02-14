import { apiClient } from "@/lib/apiClient";

export const loginRequest = async (data: { email: string; password: string }) => {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
};
