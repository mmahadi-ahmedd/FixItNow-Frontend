"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/lib/auth";

interface Booking {
  id: number;
  status: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  service: { title: string; price: string };
  customer: { name: string; email: string; phone?: string };
}

interface Service {
  id?: number;
  categoryId?: number | string;
  title: string;
  description?: string;
  price: string;
}

interface Category {
  id: number;
  name: string;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
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
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    categoryId: "",
    title: "",
    description: "",
    price: "",
  });
  const [isCreatingService, setIsCreatingService] = useState(false);


  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);

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
      const [bookingsRes, servicesRes, categoriesRes, profileRes] = await Promise.all([
        apiClient.get("/technician/bookings"),
        apiClient.get("/services"),
        apiClient.get("/categories"),
        apiClient.get("/technician/profile"),
      ]);


      setBookings(bookingsRes.data.data);
      type ServiceWithTechnician = Service & {
        technician: { user: { email: string } };
      };

      setServices(
        servicesRes.data.data.filter(
          (s: ServiceWithTechnician) => s.technician.user.email === user.email
        )
      );
      setCategories(categoriesRes.data.data);

      if (profileRes.data.data?.availability) {
        setAvailability(profileRes.data.data.availability);
      }



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



  const toggleDay = (dayOfWeek: number): void => {
    const exists: AvailabilitySlot | undefined = availability.find((s) => s.dayOfWeek === dayOfWeek);
    if (exists) {
      setAvailability((prev) => prev.filter((s) => s.dayOfWeek !== dayOfWeek));
    } else {
      setAvailability((prev) => [
        ...prev,
        { dayOfWeek, startTime: "09:00", endTime: "17:00" },
      ]);
    }
  };

  const updateSlot = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string
  ): void => {
    setAvailability((prev: AvailabilitySlot[]): AvailabilitySlot[] =>
      prev.map((s: AvailabilitySlot): AvailabilitySlot =>
        s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s
      )
    );
  };

  const saveAvailability = async (): Promise<void> => {
    if (availability.length === 0) {
      toast.error("Please select at least one day");
      return;
    }
    setIsSavingAvailability(true);
    try {
      await apiClient.put("/technician/availability", { slots: availability });
      toast.success("Availability saved successfully!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSavingAvailability(false);
    }
  };




  const updateStatus = async (
    bookingId: number,
    status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED"
  ): Promise<void> => {
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
  const createService = async (): Promise<void> => {
    if (!serviceForm.categoryId || !serviceForm.title ||
      !serviceForm.description || !serviceForm.price) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsCreatingService(true);
    try {
      const res = await apiClient.post("/services", {
        categoryId: Number(serviceForm.categoryId),
        title: serviceForm.title,
        description: serviceForm.description,
        price: Number(serviceForm.price),
      });
      toast.success("Service created successfully!");
      setServices((prev: Service[]): Service[] => [...prev, res.data.data]);
      setShowServiceForm(false);
      setServiceForm({ categoryId: "", title: "", description: "", price: "" });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCreatingService(false);
    }
  };

  const deleteService = async (serviceId: number): Promise<void> => {
    try {
      await apiClient.delete(`/services/${serviceId}`);
      toast.success("Service deleted");
      setServices((prev: Service[]): Service[] => prev.filter((s) => s.id !== serviceId));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (



    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
            <p className="text-gray-500">Manage your incoming bookings</p>
          </div>
        </div>
        {/* Availability Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Availability</h2>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 mb-4">
                Select the days you available and set your working hours.
              </p>

              <div className="space-y-3">
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                  (day, index) => {
                    const slot = availability.find((s) => s.dayOfWeek === index);
                    const isSelected = !!slot;

                    return (
                      <div
                        key={day}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isSelected
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                          }`}
                      >
                        {/* Day toggle */}
                        <button
                          onClick={() => toggleDay(index)}
                          className={`w-24 text-sm font-medium py-1 px-2 rounded ${isSelected
                            ? "bg-green-500 text-white"
                            : "bg-white border text-gray-600"
                            }`}
                        >
                          {day.slice(0, 3)}
                        </button>

                        {/* Time pickers — only show if day is selected */}
                        {isSelected && (
                          <div className="flex items-center gap-2 flex-1 flex-wrap">
                            <span className="text-sm text-gray-500">From</span>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateSlot(index, "startTime", e.target.value)
                              }
                              className="rounded border border-input px-2 py-1 text-sm"
                            />
                            <span className="text-sm text-gray-500">To</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateSlot(index, "endTime", e.target.value)
                              }
                              className="rounded border border-input px-2 py-1 text-sm"
                            />
                          </div>
                        )}

                        {!isSelected && (
                          <span className="text-sm text-gray-400">Not available</span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              <Button
                className="w-full mt-4"
                onClick={saveAvailability}
                disabled={isSavingAvailability}
              >
                {isSavingAvailability ? "Saving..." : "Save Availability"}
              </Button>
              {/* Show saved availability summary */}
              {availability.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Current Availability:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availability
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                      .map((slot) => (
                        <div
                          key={slot.dayOfWeek}
                          className="bg-green-100 border border-green-300 rounded px-3 py-1 text-sm"
                        >
                          <span className="font-medium">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][slot.dayOfWeek]}
                          </span>
                          <span className="text-gray-600 ml-1">
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Services</h2>
          <Button size="sm" onClick={() => setShowServiceForm(!showServiceForm)}>
            {showServiceForm ? "Cancel" : "+ Add Service"}
          </Button>
        </div>

        {showServiceForm && (
          <Card className="mb-4">
            <CardContent className="pt-4 space-y-3">
              <select
                value={serviceForm.categoryId}
                onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Category</option>
                {categories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Service title"
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />

              <textarea
                placeholder="Service description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />

              <input
                type="number"
                placeholder="Price ($)"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />

              <Button
                className="w-full"
                onClick={createService}
                disabled={isCreatingService}
              >
                {isCreatingService ? "Creating..." : "Create Service"}
              </Button>
            </CardContent>
          </Card>
        )}

        {services.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-gray-500 text-sm">
              No services yet. Add your first service above.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map((service: Service & { category?: Category; id?: number }) => (
              <Card key={service.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{service.title}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                        {service.category?.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${service.price}</p>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="mt-2"
                        onClick={() => service.id && deleteService(service.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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