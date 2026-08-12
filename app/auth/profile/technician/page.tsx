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


  const [profileForm, setProfileForm] = useState({
    bio: "",
    experienceYears: "",
    hourlyRate: "",
    location: "",
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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


      const profileData = profileRes.data.data;
      if (profileData) {
        setProfileForm({
          bio: profileData.bio || "",
          experienceYears: String(profileData.experienceYears || ""),
          hourlyRate: String(profileData.hourlyRate || ""),
          location: profileData.location || "",
        });
        if (profileData.availability) {
          setAvailability(profileData.availability);
        }
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


  const saveProfile = async (): Promise<void> => {
    if (!profileForm.location) {
      toast.error("Location is required");
      return;
    }
    setIsSavingProfile(true);
    try {
      await apiClient.put("/technician/profile", {
        bio: profileForm.bio,
        experienceYears: Number(profileForm.experienceYears),
        hourlyRate: Number(profileForm.hourlyRate),
        location: profileForm.location,
      });
      toast.success("Profile updated successfully!");
      setShowProfileForm(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSavingProfile(false);
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
        {/* Profile Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Profile</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowProfileForm(!showProfileForm)}
            >
              {showProfileForm ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {/* Profile Summary — always visible */}
          {!showProfileForm && (
            <Card>
              <CardContent className="pt-4 space-y-2 text-sm text-gray-600">
                {profileForm.bio && <p>📝 {profileForm.bio}</p>}
                {profileForm.location && <p>📍 {profileForm.location}</p>}
                {profileForm.experienceYears && (
                  <p>🛠 {profileForm.experienceYears} years experience</p>
                )}
                {profileForm.hourlyRate && (
                  <p>💰 ${profileForm.hourlyRate}/hr</p>
                )}
                {!profileForm.bio && !profileForm.location && (
                  <p className="text-gray-400">
                    No profile set up yet. Click `Edit Profile` to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Edit Form */}
          {showProfileForm && (
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    placeholder="Tell customers about your experience and expertise..."
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, location: e.target.value })
                    }
                    placeholder="Dhaka, Bangladesh"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={profileForm.experienceYears}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        experienceYears: e.target.value,
                      })
                    }
                    placeholder="5"
                    min="0"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={profileForm.hourlyRate}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, hourlyRate: e.target.value })
                    }
                    placeholder="25"
                    min="0"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={saveProfile}
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
    
      </div>
    </div>

  );
}