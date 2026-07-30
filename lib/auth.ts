import { apiClient } from "@/lib/api-client";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
}

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const res = await apiClient.get("/auth/me");
    return res.data.data.profile;
  } catch {
    return null;
  }

  
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  // Clear the cookie set by the interceptor
  document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/auth/login";
};