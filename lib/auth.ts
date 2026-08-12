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

export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch {
    
  } finally {
    window.location.href = "/auth/login";
  }
};