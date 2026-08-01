"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";

interface Booking {
  id: number;
  status: string;
  scheduledAt: string;
  address: string;
  service: { title: string; price: string };
  technician: { user: { name: string } };
  payment?: { status: string; amount: string };
  review?: { id: number };
}

const statusColors: Record<string, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  DECLINED: "bg-red-100 text-red-800",
  PAID: "bg-purple-100 text-purple-800",
  IN_PROGRESS: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-200 text-red-900",
};

export default function CustomerDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      if (user.role !== "CUSTOMER") {
        router.push(`/auth/dashboard/${user.role.toLowerCase()}`);
        return;
      }
      setUserName(user.name);
      setAuthChecked(true);
    };
    checkAuth();
  }, [router]);

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery<Booking[]>({
    queryKey: ["customer-bookings"],
    queryFn: async () => {
      const res = await apiClient.get("/bookings");
      return res.data.data;
    },
    enabled: authChecked, 
  });

  const cancelBooking = async (bookingId: number) => {
    try {
      await apiClient.patch(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      refetch(); 
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!authChecked || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
          <p className="text-gray-500">Manage your bookings and payments</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No bookings yet.{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/services")}
            >
              Browse services
            </span>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    {booking.service.title}
                  </CardTitle>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>Technician: {booking.technician.user.name}</p>
                <p>Address: {booking.address}</p>
                <p>
                  Scheduled:{" "}
                  {new Date(booking.scheduledAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p>Price: ${booking.service.price}</p>

                {booking.payment && (
                  <p>
                    Payment:{" "}
                    <Badge variant="outline">{booking.payment.status}</Badge>
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  {booking.status === "ACCEPTED" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/auth/dashboard/customer/pay/${booking.id}`
                        )
                      }
                    >
                      Pay Now
                    </Button>
                  )}

                  {booking.status === "COMPLETED" && !booking.review && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/auth/dashboard/customer/review/${booking.id}`
                        )
                      }
                    >
                      Leave Review
                    </Button>
                  )}

                  {!["IN_PROGRESS", "COMPLETED", "CANCELLED", "DECLINED"].includes(
                    booking.status
                  ) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}