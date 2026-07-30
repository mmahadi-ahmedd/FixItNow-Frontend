"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";

interface Booking {
  id: number;
  status: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  service: { title: string; price: string };
  customer: { name: string; email: string; phone?: string };
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

export default function TechnicianDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      if (user.role !== "TECHNICIAN") {
        router.push(`/auth/dashboard/${user.role.toLowerCase()}`);
        return;
      }
      setUserName(user.name);

      try {
        const res = await apiClient.get("/technician/bookings");
        setBookings(res.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [router]);

  const updateStatus = async (
    bookingId: number,
    status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    try {
      await apiClient.patch(`/technician/bookings/${bookingId}`, { status });
      toast.success(`Booking marked as ${status}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
          <p className="text-gray-500">Manage your incoming bookings</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("accessToken");
            router.push("/auth/login");
          }}
        >
          Logout
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No bookings yet.
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
                <p>Customer: {booking.customer.name} ({booking.customer.email})</p>
                {booking.customer.phone && (
                  <p>Phone: {booking.customer.phone}</p>
                )}
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
                {booking.notes && <p>Notes: {booking.notes}</p>}

                <div className="flex gap-2 pt-2 flex-wrap">
                  {booking.status === "REQUESTED" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(booking.id, "ACCEPTED")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(booking.id, "DECLINED")}
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  {booking.status === "PAID" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(booking.id, "IN_PROGRESS")}
                    >
                      Start Job
                    </Button>
                  )}

                  {booking.status === "IN_PROGRESS" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(booking.id, "COMPLETED")}
                    >
                      Mark Completed
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