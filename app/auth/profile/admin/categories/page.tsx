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

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "users" | "bookings" | "categories"
  >("categories");

  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // --------------------------------------------------
  // Category Pagination
  // --------------------------------------------------

  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);

  const CATEGORIES_PER_PAGE = 6;

  const totalCategoryPages = Math.ceil(
    categories.length / CATEGORIES_PER_PAGE
  );

  const categoryStartIndex =
    (currentCategoryPage - 1) * CATEGORIES_PER_PAGE;

  const currentCategories = categories.slice(
    categoryStartIndex,
    categoryStartIndex + CATEGORIES_PER_PAGE
  );

  // --------------------------------------------------
  // Load Dashboard Data
  // --------------------------------------------------

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
        const [
          usersRes,
          bookingsRes,
          categoriesRes,
        ] = await Promise.all([
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

  // --------------------------------------------------
  // Update User Status
  // --------------------------------------------------

  const updateUserStatus = async (
    userId: number,
    status: "ACTIVE" | "BANNED"
  ) => {
    try {
      await apiClient.patch(`/admin/users/${userId}`, {
        status,
      });

      toast.success(
        `User ${status === "BANNED" ? "banned" : "unbanned"
        } successfully`
      );

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status }
            : user
        )
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // --------------------------------------------------
  // Create Category
  // --------------------------------------------------

  const createCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsCreatingCategory(true);

    try {
      const res = await apiClient.post(
        "/admin/categories",
        {
          name: categoryForm.name,
          description: categoryForm.description,
        }
      );

      toast.success("Category created successfully!");

      setCategories((prev) => [
        ...prev,
        res.data.data,
      ]);

      setCategoryForm({
        name: "",
        description: "",
      });

      setShowCategoryForm(false);

      // Move to the last page so the newly created
      // category can be seen immediately.
      const newCategoryCount = categories.length + 1;

      const newTotalPages = Math.ceil(
        newCategoryCount / CATEGORIES_PER_PAGE
      );

      setCurrentCategoryPage(newTotalPages);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-gray-500">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Page
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage users, bookings and service categories.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">

        </div>

        {/* ================================================== */}
        {/* Users */}
        {/* ================================================== */}

        {activeTab === "users" && (
          <div className="space-y-4">

            {users.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-gray-500">
                  No users found.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="h-full"
                  >
                    <CardContent className="flex h-full items-center justify-between gap-4 py-5">

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {user.name}
                        </p>

                        <p className="mt-1 truncate text-sm text-gray-500">
                          {user.email}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">

                          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {user.role}
                          </span>

                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${user.status ===
                                "ACTIVE"
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
                            user.status ===
                              "ACTIVE"
                              ? "destructive"
                              : "outline"
                          }
                          onClick={() =>
                            updateUserStatus(
                              user.id,
                              user.status ===
                                "ACTIVE"
                                ? "BANNED"
                                : "ACTIVE"
                            )
                          }
                        >
                          {user.status ===
                            "ACTIVE"
                            ? "Ban"
                            : "Unban"}
                        </Button>
                      )}

                    </CardContent>
                  </Card>
                ))}

              </div>
            )}

          </div>
        )}

        {/* ================================================== */}
        {/* Bookings */}
        {/* ================================================== */}

        {activeTab === "bookings" && (
          <div className="space-y-4">

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-gray-500">
                  No bookings found.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="space-y-3 py-5">

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <p className="font-semibold text-gray-900">
                            {booking.service.title}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Booking #
                            {booking.id}
                          </p>
                        </div>

                        <span className="shrink-0 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {booking.status}
                        </span>

                      </div>

                      <div className="space-y-1 text-sm text-gray-600">

                        <p>
                          Customer:{" "}
                          <span className="font-medium text-gray-900">
                            {
                              booking
                                .customer
                                .name
                            }
                          </span>
                        </p>

                        <p>
                          Technician:{" "}
                          <span className="font-medium text-gray-900">
                            {
                              booking
                                .technician
                                .user
                                .name
                            }
                          </span>
                        </p>

                      </div>

                    </CardContent>
                  </Card>
                ))}

              </div>
            )}

          </div>
        )}

        {/* ================================================== */}
        {/* Categories */}
        {/* ================================================== */}

        {activeTab === "categories" && (
          <div className="space-y-6">

            

            {/* Create Category Form */}
            {showCategoryForm && (
              <Card>
                <CardContent className="p-5 sm:p-6">

                  <div className="space-y-5">

                    <div>
                      <label
                        htmlFor="category-name"
                        className="mb-2 block text-sm font-medium text-gray-900"
                      >
                        Category Name
                      </label>

                      <input
                        id="category-name"
                        type="text"
                        value={
                          categoryForm.name
                        }
                        onChange={(e) =>
                          setCategoryForm(
                            (prev) => ({
                              ...prev,
                              name: e
                                .target
                                .value,
                            })
                          )
                        }
                        placeholder="Enter category name"
                        className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="category-description"
                        className="mb-2 block text-sm font-medium text-gray-900"
                      >
                        Description
                      </label>

                      <textarea
                        id="category-description"
                        value={
                          categoryForm.description
                        }
                        onChange={(e) =>
                          setCategoryForm(
                            (prev) => ({
                              ...prev,
                              description:
                                e
                                  .target
                                  .value,
                            })
                          )
                        }
                        rows={4}
                        placeholder="Describe this service category"
                        className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCategoryForm(
                            false
                          );

                          setCategoryForm({
                            name: "",
                            description:
                              "",
                          });
                        }}
                        disabled={
                          isCreatingCategory
                        }
                      >
                        Cancel
                      </Button>

                      <Button
                        onClick={
                          createCategory
                        }
                        disabled={
                          isCreatingCategory
                        }
                      >
                        {isCreatingCategory
                          ? "Creating..."
                          : "Create Category"}
                      </Button>

                    </div>

                  </div>

                </CardContent>
              </Card>
            )}

            {/* Categories List */}
            {categories.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-gray-500">
                  No categories yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">

                {/* Category Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {currentCategories.map(
                    (category) => (
                      <Card
                        key={category.id}
                        className="h-full"
                      >
                        <CardContent className="flex h-full flex-col py-5">

                          <p className="font-semibold text-gray-900">
                            {
                              category.name
                            }
                          </p>

                          {category.description && (
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                              {
                                category.description
                              }
                            </p>
                          )}

                        </CardContent>
                      </Card>
                    )
                  )}

                </div>

                {/* Pagination */}
                {totalCategoryPages > 1 && (
                  <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Page Information */}
                    <p className="text-center text-sm text-gray-500 sm:text-left">
                      Showing{" "}
                      {categoryStartIndex +
                        1}{" "}
                      -{" "}
                      {Math.min(
                        categoryStartIndex +
                        CATEGORIES_PER_PAGE,
                        categories.length
                      )}{" "}
                      of{" "}
                      {categories.length}{" "}
                      categories
                    </p>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-center gap-1">

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentCategoryPage ===
                          1
                        }
                        onClick={() =>
                          setCurrentCategoryPage(
                            (prev) =>
                              prev -
                              1
                          )
                        }
                      >
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">

                        {Array.from(
                          {
                            length: totalCategoryPages,
                          },
                          (
                            _,
                            index
                          ) =>
                            index +
                            1
                        ).map(
                          (page) => (
                            <Button
                              key={
                                page
                              }
                              size="sm"
                              variant={
                                currentCategoryPage ===
                                  page
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                setCurrentCategoryPage(
                                  page
                                )
                              }
                              className="min-w-9"
                            >
                              {
                                page
                              }
                            </Button>
                          )
                        )}

                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentCategoryPage ===
                          totalCategoryPages
                        }
                        onClick={() =>
                          setCurrentCategoryPage(
                            (prev) =>
                              prev +
                              1
                          )
                        }
                      >
                        Next
                      </Button>

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}