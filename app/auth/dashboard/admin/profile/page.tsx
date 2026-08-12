"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { apiClient } from "@/lib/api-client";
import { getCurrentUser, type CurrentUser } from "@/lib/auth";

type User = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN" | string;
  status: "ACTIVE" | "BANNED" | string;
  createdAt: string;
};

type Booking = {
  id: string;
  status: string;
};
import { Users, ShoppingBag, CreditCard, TrendingUp } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser || currentUser.role !== "ADMIN") {
        router.push("/auth/login");
        return;
      }
      setUser(currentUser);
    };
    checkAuth();
  }, [router]);

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["admin-users-profile"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/users");
      return res.data.data as User[];
    },
    enabled: !!user,
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["admin-bookings-profile"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/bookings");
      return res.data.data as Booking[];
    },
    enabled: !!user,
  });

  // Stats
  const totalUsers = users.length;
  const totalCustomers = users.filter((u) => u.role === "CUSTOMER").length;
  const totalTechnicians = users.filter((u) => u.role === "TECHNICIAN").length;
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
  const bannedUsers = users.filter((u) => u.status === "BANNED").length;

  // Role distribution for pie
  const roleData = [
    { name: "Customers", value: totalCustomers },
    { name: "Technicians", value: totalTechnicians },
    { name: "Admins", value: users.filter((u) => u.role === "ADMIN").length },
  ];

  // Booking status for bar chart
  const statusData = Object.entries(
    bookings.reduce((acc: Record<string, number>, b: Booking) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // User growth (by createdAt month)
  const userGrowth = users.reduce((acc: Record<string, number>, u: User) => {
    const month = new Date(u.createdAt).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const lineData = Object.entries(userGrowth).map(([month, count]) => ({ month, count }));

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-red-600 text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              <Badge className="mt-2 bg-red-100 text-red-700 dark:bg-red-900/30">
                {user.role}
              </Badge>
            </div>
            <Button variant="outline" onClick={() => router.push("/auth/dashboard/admin")}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: totalUsers, icon: <Users className="h-5 w-5" />, color: "text-blue-600" },
          { label: "Total Bookings", value: totalBookings, icon: <ShoppingBag className="h-5 w-5" />, color: "text-green-600" },
          { label: "Completed Jobs", value: completedBookings, icon: <CreditCard className="h-5 w-5" />, color: "text-purple-600" },
          { label: "Banned Users", value: bannedUsers, icon: <TrendingUp className="h-5 w-5" />, color: "text-red-600" },
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
        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={roleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {roleData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Line Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">User Growth by Month</CardTitle>
          </CardHeader>
          <CardContent>
            {lineData.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">Email</th>
                  <th className="pb-2 pr-4">Role</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{u.name}</td>
                    <td className="py-2 pr-4 text-gray-500">{u.email}</td>
                    <td className="py-2 pr-4">
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        u.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}