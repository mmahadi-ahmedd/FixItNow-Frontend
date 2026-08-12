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
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { getCurrentUser, type CurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import { CalendarDays, CreditCard, Star, Clock } from "lucide-react";

type Booking = {
  id: string;
  status: string;
  service: { title: string };
  technician: { user: { name: string } };
  createdAt?: string;
  scheduledAt: string;
};

type Payment = {
  amount: string | number;
  status: string;
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function CustomerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.role !== "CUSTOMER") {
        router.push("/auth/login");
        return;
      }
      setUser(currentUser);
    };
    checkAuth();
  }, [router]);

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["customer-bookings-profile"],
    queryFn: async () => {
      const res = await apiClient.get("/bookings");
      return res.data.data;
    },
    enabled: !!user,
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["customer-payments-profile"],
    queryFn: async () => {
      const res = await apiClient.get("/payments");
      return res.data.data;
    },
    enabled: !!user,
  });

  // Stats
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingBookings = bookings.filter((b) =>
    ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status)
  ).length;

  // Booking status distribution for pie chart
  const statusData = Object.entries(
    bookings.reduce((acc: Record<string, number>, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Monthly bookings for bar chart
  const monthlyData = bookings.reduce((acc: Record<string, number>, b) => {
    const month = new Date(b.createdAt || b.scheduledAt).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(monthlyData).map(([month, count]) => ({ month, count }));

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30">
                {user.role}
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/auth/dashboard/customer")}
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: totalBookings, icon: <CalendarDays className="h-5 w-5" />, color: "text-blue-600" },
          { label: "Completed", value: completedBookings, icon: <Star className="h-5 w-5" />, color: "text-green-600" },
          { label: "Pending", value: pendingBookings, icon: <Clock className="h-5 w-5" />, color: "text-yellow-600" },
          { label: "Total Spent", value: `$${totalSpent.toFixed(0)}`, icon: <CreditCard className="h-5 w-5" />, color: "text-purple-600" },
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
        {/* Bar Chart - Monthly Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No booking data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Booking Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No booking data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
          <CardTitle className="text-base">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 pr-4">Service</th>
                    <th className="pb-2 pr-4">Technician</th>
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{b.service.title}</td>
                      <td className="py-2 pr-4 text-gray-500">{b.technician.user.name}</td>
                      <td className="py-2 pr-4 text-gray-500">
                        {new Date(b.scheduledAt).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          b.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                          b.status === "PAID" ? "bg-purple-100 text-purple-700" :
                          b.status === "ACCEPTED" ? "bg-blue-100 text-blue-700" :
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