import axios from "axios";

export const apiClient = axios.create({
  baseURL:  "/api",
  withCredentials: true, 
});



export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Something went wrong. Please try again.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};