"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, getErrorMessage } from "@/lib/api-client";

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  category: { name: string };
  technician: {
    id: number;
    location: string;
    avgRating: string;
    user: { name: string };
  };
}

interface Category {
  id: number;
  name: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          apiClient.get("/services"),
          apiClient.get("/categories"),
        ]);
        setServices(servicesRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = services.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      s.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Browse Services</h1>
      <p className="text-gray-500 mb-6">
        Find the right professional for your home needs
      </p>

      <div className="flex gap-3 mb-6 flex-wrap">
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {(search || selectedCategory) && (
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setSelectedCategory("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {!isLoading && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} service{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No services found. Try adjusting your filters.
          </CardContent>
        </Card>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{service.title}</CardTitle>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {service.category.name}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>{service.description}</p>
                <p>📍 {service.technician.location}</p>
                <p>
                  ⭐ {Number(service.technician.avgRating).toFixed(1)} rating
                </p>
                <p className="font-semibold text-gray-900">
                  Starting from ${service.price}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-gray-400">
                    by {service.technician.user.name}
                  </p>
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/technicians/${service.technician.id}`)
                    }
                  >
                    View Technician
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}