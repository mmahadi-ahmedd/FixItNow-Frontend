"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { apiClient } from "@/lib/api-client";
import { getCurrentUser, type CurrentUser } from "@/lib/auth";
import { Briefcase, Star, DollarSign, Clock } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function TechnicianProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.role !== "TECHNICIAN") {
        router.push("/auth/login");
        return;
      }
      setUser(currentUser);
    };
    checkAuth();
  }, [router]);

  interface Booking {
    id: string;
    status: string;
    scheduledAt: string;
    service: {
      title: string;
      price: number;
    };
    customer: {
      name: string;
    };
  }

  interface TechnicianProfile {
    location?: string;
    experienceYears: number;
    hourlyRate: number;
    avgRating: number;
  }

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["technician-bookings-profile"],
    queryFn: async () => {
      const res = await apiClient.get("/technician/bookings");
      return res.data.data;
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery<TechnicianProfile>({
    queryKey: ["technician-profile-data"],
    queryFn: async () => {
      const res = await apiClient.get("/technician/profile");
      return res.data.data;
    },
    enabled: !!user,
  });

  // Stats
  const totalJobs = bookings.length;
  const completedJobs = bookings.filter((b) => b.status === "COMPLETED").length;
  const pendingJobs = bookings.filter((b) => ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status)).length;
  const totalEarnings = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + Number(b.service?.price || 0), 0);

  // Status distribution
  const statusData = Object.entries(
    bookings.reduce((acc: Record<string, number>, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Monthly completed jobs
  const monthlyData = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((acc: Record<string, number>, b) => {
      const month = new Date(b.scheduledAt).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const barData = Object.entries(monthlyData).map(([month, count]) => ({ month, count }));

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-green-600 text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900/30">
                {user.role}
              </Badge>
              {profile && (
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  {profile.location && <span>📍 {profile.location}</span>}
                  {profile.experienceYears > 0 && <span>🛠 {profile.experienceYears} years exp</span>}
                  {profile.hourlyRate > 0 && <span>💰 ${profile.hourlyRate}/hr</span>}
                  <span>⭐ {Number(profile.avgRating).toFixed(1)} rating</span>
                </div>
              )}
            </div>
            <Button variant="outline" onClick={() => router.push("/auth/dashboard/technician")}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Jobs", value: totalJobs, icon: <Briefcase className="h-5 w-5" />, color: "text-blue-600" },
          { label: "Completed", value: completedJobs, icon: <Star className="h-5 w-5" />, color: "text-green-600" },
          { label: "Pending", value: pendingJobs, icon: <Clock className="h-5 w-5" />, color: "text-yellow-600" },
          { label: "Total Earned", value: `$${totalEarnings.toFixed(0)}`, icon: <DollarSign className="h-5 w-5" />, color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4">
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No completed jobs yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Job Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No job data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">No jobs yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 pr-4">Service</th>
                    <th className="pb-2 pr-4">Customer</th>
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Price</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{b.service.title}</td>
                      <td className="py-2 pr-4 text-gray-500">{b.customer.name}</td>
                      <td className="py-2 pr-4 text-gray-500">
                        {new Date(b.scheduledAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-4">${b.service.price}</td>
                      <td className="py-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          b.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                          b.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}