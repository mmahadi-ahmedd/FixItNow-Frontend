"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";

interface TechnicianProfile {
  id: number;
  bio: string;
  experienceYears: number;
  hourlyRate: string;
  location: string;
  avgRating: string;
  user: { name: string; email: string; phone?: string };
  services: {
    id: number;
    title: string;
    description: string;
    price: string;
    category: { name: string };
  }[];
  reviews: {
    id: number;
    rating: number;
    comment?: string;
    customer: { name: string };
    createdAt: string;
  }[];
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TechnicianProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await apiClient.get(`/technicians/${id}`);
        setTechnician(res.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

 const handleBookNow = async () => {
    const user = await getCurrentUser();
    if (!user) {
      toast.error("Please login to book a service");
      router.push("/auth/login");
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customers can book services");
      return;
    }
    setShowBookingForm(true);
  };
  const handleSubmitBooking = async () => {
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }
    if (!scheduledAt) {
      toast.error("Please select a date and time");
      return;
    }
    if (!address) {
      toast.error("Please enter your address");
      return;
    }

    setIsBooking(true);
    try {
      await apiClient.post("/bookings", {
        serviceId: selectedService,
        scheduledAt: new Date(scheduledAt).toISOString(),
        address,
        notes,
      });
      toast.success("Booking created successfully!");
      router.push("/auth/dashboard/customer");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Technician not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Back button */}
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">{technician.user.name}</h1>
              <p className="text-gray-500">📍 {technician.location}</p>
              <p className="text-gray-500">
                ⭐ {Number(technician.avgRating).toFixed(1)} rating ·{" "}
                {technician.experienceYears} years experience
              </p>
              {technician.bio && (
                <p className="text-gray-600 mt-2 max-w-xl">{technician.bio}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                ${technician.hourlyRate}/hr
              </p>
              {!showBookingForm && (
                <Button className="mt-2" onClick={handleBookNow}>
                  Book Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showBookingForm && (
        <Card>
          <CardHeader>
            <CardTitle>Book a Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Select Service
              </label>
              <select
                value={selectedService || ""}
                onChange={(e) => setSelectedService(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Choose a service...</option>
                {technician.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — ${s.price} ({s.category.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Your Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House 12, Road 5, Dhaka"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitBooking}
                disabled={isBooking}
                className="flex-1"
              >
                {isBooking ? "Booking..." : "Confirm Booking"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowBookingForm(false)}
                disabled={isBooking}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">Services Offered</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {technician.services.map((service) => (
            <Card key={service.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="text-sm text-gray-500">
                      {service.description}
                    </p>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                      {service.category.name}
                    </span>
                  </div>
                  <p className="font-semibold text-sm">${service.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {technician.availability.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Availability</h2>
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-3 flex-wrap">
                {technician.availability.map((slot, i) => (
                  <div
                    key={i}
                    className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm"
                  >
                    <p className="font-medium">{DAYS[slot.dayOfWeek]}</p>
                    <p className="text-gray-500">
                      {slot.startTime} – {slot.endTime}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">
          Reviews ({technician.reviews.length})
        </h2>
        {technician.reviews.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-gray-500 text-sm">
              No reviews yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {technician.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{review.customer.name}</p>
                    <p className="text-sm">{"⭐".repeat(review.rating)}</p>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 mt-1">
                      {review.comment}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}