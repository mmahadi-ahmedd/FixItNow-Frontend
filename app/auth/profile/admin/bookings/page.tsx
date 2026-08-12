"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";

interface Booking {
  id: number;
  status: string;
  customer: {
    name: string;
  };
  technician: {
    user: {
      name: string;
    };
  };
  service: {
    title: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] =
    useState<"bookings">("bookings");

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const [currentPage, setCurrentPage] = useState(1);

  const BOOKINGS_PER_PAGE = 6;

  const totalPages = Math.ceil(
    bookings.length / BOOKINGS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * BOOKINGS_PER_PAGE;

  const currentBookings = bookings.slice(
    startIndex,
    startIndex + BOOKINGS_PER_PAGE
  );

  // --------------------------------------------------
  // Load Data
  // --------------------------------------------------

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      if (user.role !== "ADMIN") {
        router.push(
          `/auth/dashboard/${user.role.toLowerCase()}`
        );
        return;
      }

      try {
        const bookingsRes = await apiClient.get(
          "/admin/bookings"
        );

        setBookings(bookingsRes.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

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
  // Status Styles
  // --------------------------------------------------

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      REQUESTED:
        "bg-yellow-100 text-yellow-800",
      ACCEPTED:
        "bg-blue-100 text-blue-800",
      DECLINED:
        "bg-red-100 text-red-800",
      PAID:
        "bg-purple-100 text-purple-800",
      IN_PROGRESS:
        "bg-green-100 text-green-800",
      COMPLETED:
        "bg-gray-100 text-gray-800",
      CANCELLED:
        "bg-red-200 text-red-900",
    };

    return (
      styles[status] ||
      "bg-gray-100 text-gray-800"
    );
  };

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
            Monitor and manage all service bookings.
          </p>

        </div>

        {/* Tab */}
        <div className="mb-6 overflow-x-auto">

          

        </div>

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div className="space-y-6">

            {/* Empty State */}
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">

                  <p className="font-medium text-gray-900">
                    No bookings found
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    There are currently no service bookings to display.
                  </p>

                </CardContent>
              </Card>
            ) : (
              <>
                {/* Booking Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {currentBookings.map(
                    (booking) => (
                      <Card
                        key={booking.id}
                        className="h-full transition-shadow hover:shadow-md"
                      >

                        <CardContent className="flex h-full flex-col p-5">

                          {/* Top */}
                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-gray-900">
                                {
                                  booking
                                    .service
                                    .title
                                }
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                Booking #
                                {
                                  booking.id
                                }
                              </p>

                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                booking.status
                              )}`}
                            >
                              {
                                booking.status
                              }
                            </span>

                          </div>

                          {/* Booking Information */}
                          <div className="mt-5 space-y-3">

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Customer
                              </p>

                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {
                                  booking
                                    .customer
                                    .name
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Technician
                              </p>

                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {
                                  booking
                                    .technician
                                    .user
                                    .name
                                }
                              </p>
                            </div>

                          </div>

                        </CardContent>

                      </Card>
                    )
                  )}

                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Result Information */}
                    <p className="text-center text-sm text-gray-500 sm:text-left">

                      Showing{" "}
                      {startIndex + 1}{" "}
                      -{" "}
                      {Math.min(
                        startIndex +
                        BOOKINGS_PER_PAGE,
                        bookings.length
                      )}{" "}
                      of{" "}
                      {bookings.length}{" "}
                      bookings

                    </p>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-1">

                      {/* Previous */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentPage ===
                          1
                        }
                        onClick={() =>
                          setCurrentPage(
                            (prev) =>
                              prev -
                              1
                          )
                        }
                      >
                        Previous
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">

                        {Array.from(
                          {
                            length: totalPages,
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
                                currentPage ===
                                  page
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                setCurrentPage(
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

                      {/* Next */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        onClick={() =>
                          setCurrentPage(
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

              </>
            )}

          </div>
        )}

      </div>

    </main>
  );
}