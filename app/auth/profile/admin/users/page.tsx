"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Booking {
  id: number;
  status: string;
  customer: { name: string };
  technician: { user: { name: string } };
  service: { title: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "bookings" | "categories">("users");
  const [categories, setCategories] = useState<{ id: number; name: string; description?: string }[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 6;
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentUsers = users.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      if (user.role !== "ADMIN") {
        router.push(`/auth/dashboard/${user.role.toLowerCase()}`);
        return;
      }

      try {
        const [usersRes, bookingsRes, categoriesRes] = await Promise.all([
          apiClient.get("/admin/users"),
          apiClient.get("/admin/bookings"),
          apiClient.get("/admin/categories"),
        ]);
        setUsers(usersRes.data.data);
        setBookings(bookingsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [router]);

  const updateUserStatus = async (
    userId: number,
    status: "ACTIVE" | "BANNED"
  ) => {
    try {
      await apiClient.patch(`/admin/users/${userId}`, { status });
      toast.success(
        `User ${status === "BANNED" ? "banned" : "unbanned"} successfully`
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const createCategory = async () => {
    if (!categoryForm.name) {
      toast.error("Category name is required");
      return;
    }
    setIsCreatingCategory(true);
    try {
      const res = await apiClient.post("/admin/categories", {
        name: categoryForm.name,
        description: categoryForm.description,
      });
      toast.success("Category created successfully!");
      setCategories((prev) => [...prev, res.data.data]);
      setCategoryForm({ name: "", description: "" });
      setShowCategoryForm(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCreatingCategory(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading admin profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {activeTab === "users" && (
        <div className="space-y-6">

          {/* User Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {currentUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="flex items-center justify-between py-5">

                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {user.name}
                    </p>

                    <p className="truncate text-sm text-gray-500">
                      {user.email}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">

                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                        {user.role}
                      </span>

                      <span
                        className={`rounded px-2 py-0.5 text-xs ${user.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {user.status}
                      </span>

                    </div>
                  </div>

                  {user.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant={
                        user.status === "ACTIVE"
                          ? "destructive"
                          : "outline"
                      }
                      onClick={() =>
                        updateUserStatus(
                          user.id,
                          user.status === "ACTIVE"
                            ? "BANNED"
                            : "ACTIVE"
                        )
                      }
                    >
                      {user.status === "ACTIVE"
                        ? "Ban"
                        : "Unban"}
                    </Button>
                  )}

                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">

              {/* Previous */}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={
                      currentPage === page
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setCurrentPage(page)
                    }
                  >
                    {page}
                  </Button>
                ))}
              </div>

              {/* Next */}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
              >
                Next
              </Button>

            </div>
          )}

          {/* Page Information */}
          <p className="text-center text-sm text-gray-500">
            Showing{" "}
            {users.length === 0
              ? 0
              : startIndex + 1}{" "}
            -{" "}
            {Math.min(
              startIndex + USERS_PER_PAGE,
              users.length
            )}{" "}
            of {users.length} users
          </p>

        </div>
      )}
    </div>
  );
}