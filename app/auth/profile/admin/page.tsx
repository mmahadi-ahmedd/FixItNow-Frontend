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
        <p className="text-gray-500">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">
            {users.length} users · {bookings.length} bookings · {categories.length} categories
          </p>
        </div>
        {/* <Button
          variant="outline"
           onClick={logout}
        >
          
        </Button> */}
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "users" ? "default" : "outline"}
          onClick={() => setActiveTab("users")}
        >
          Users
        </Button>
        <Button
          variant={activeTab === "bookings" ? "default" : "outline"}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </Button>
        <Button
          variant={activeTab === "categories" ? "default" : "outline"}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </Button>
      </div>

      {activeTab === "users" && (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {user.role}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${user.status === "ACTIVE"
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
                    variant={user.status === "ACTIVE" ? "destructive" : "outline"}
                    onClick={() =>
                      updateUserStatus(
                        user.id,
                        user.status === "ACTIVE" ? "BANNED" : "ACTIVE"
                      )
                    }
                  >
                    {user.status === "ACTIVE" ? "Ban" : "Unban"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{booking.service.title}</p>
                    <p className="text-sm text-gray-500">
                      Customer: {booking.customer.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Technician: {booking.technician.user.name}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${{
                      REQUESTED: "bg-yellow-100 text-yellow-800",
                      ACCEPTED: "bg-blue-100 text-blue-800",
                      DECLINED: "bg-red-100 text-red-800",
                      PAID: "bg-purple-100 text-purple-800",
                      IN_PROGRESS: "bg-green-100 text-green-800",
                      COMPLETED: "bg-gray-100 text-gray-800",
                      CANCELLED: "bg-red-200 text-red-900",
                    }[booking.status] || "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {categories.length} categories total
            </p>
            <Button
              size="sm"
              onClick={() => setShowCategoryForm(!showCategoryForm)}
            >
              {showCategoryForm ? "Cancel" : "+ Add Category"}
            </Button>
          </div>

          {/* Create Form */}
          {showCategoryForm && (
            <Card>
              <CardContent className="pt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Category name (e.g. Plumbing)"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button
                  className="w-full"
                  onClick={createCategory}
                  disabled={isCreatingCategory}
                >
                  {isCreatingCategory ? "Creating..." : "Create Category"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Categories List */}
          {categories.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center text-gray-500 text-sm">
                No categories yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <Card key={cat.id}>
                  <CardContent className="py-4">
                    <p className="font-medium">{cat.name}</p>
                    {cat.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {cat.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}