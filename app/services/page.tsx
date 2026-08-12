"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  apiClient,
  getErrorMessage,
} from "@/lib/api-client";

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  category: {
    name: string;
  };
  technician: {
    id: number;
    location: string;
    avgRating: string;
    user: {
      name: string;
    };
  };
}

interface Category {
  id: number;
  name: string;
}

export default function ServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [sortBy, setSortBy] = useState("default");

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const [currentPage, setCurrentPage] = useState(1);

  const SERVICES_PER_PAGE = 6;

  // --------------------------------------------------
  // Load Data
  // --------------------------------------------------

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          servicesRes,
          categoriesRes,
        ] = await Promise.all([
          apiClient.get("/services"),
          apiClient.get("/categories"),
        ]);

        setServices(servicesRes.data.data);
        setCategories(
          categoriesRes.data.data
        );
      } catch (error) {
        toast.error(
          getErrorMessage(error)
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // --------------------------------------------------
  // Filter + Search
  // --------------------------------------------------

  const filteredServices = services.filter(
    (service) => {
      const searchTerm =
        search.trim().toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        service.title
          .toLowerCase()
          .includes(searchTerm) ||
        service.description
          .toLowerCase()
          .includes(searchTerm) ||
        service.technician.user.name
          .toLowerCase()
          .includes(searchTerm);

      const matchesCategory =
        selectedCategory === "" ||
        service.category.name ===
        selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------

  const sortedServices = [
    ...filteredServices,
  ].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (
          Number(a.price) -
          Number(b.price)
        );

      case "price-high":
        return (
          Number(b.price) -
          Number(a.price)
        );

      case "rating-high":
        return (
          Number(
            b.technician.avgRating
          ) -
          Number(
            a.technician.avgRating
          )
        );

      case "name-az":
        return a.title.localeCompare(
          b.title
        );

      case "name-za":
        return b.title.localeCompare(
          a.title
        );

      default:
        return 0;
    }
  });

  // --------------------------------------------------
  // Pagination Calculations
  // --------------------------------------------------

  const totalPages = Math.ceil(
    sortedServices.length /
    SERVICES_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) *
    SERVICES_PER_PAGE;

  const currentServices =
    sortedServices.slice(
      startIndex,
      startIndex + SERVICES_PER_PAGE
    );

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSortBy("default");
    setCurrentPage(1);
  };

  const hasFilters =
    search !== "" ||
    selectedCategory !== "" ||
    sortBy !== "default";

  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="mb-8">
            <Skeleton className="h-8 w-48" />

            <Skeleton className="mt-3 h-4 w-80 max-w-full" />
          </div>

          {/* Filter Skeleton */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-10 w-full sm:max-w-xs" />
            <Skeleton className="h-10 w-full sm:w-48" />
            <Skeleton className="h-10 w-full sm:w-48" />
          </div>

          {/* Card Skeletons */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {[...Array(6)].map(
              (_, index) => (
                <Card
                  key={index}
                  className="h-full"
                >
                  <CardContent className="space-y-4 p-6">

                    <Skeleton className="h-6 w-3/4" />

                    <Skeleton className="h-4 w-full" />

                    <Skeleton className="h-4 w-5/6" />

                    <Skeleton className="h-4 w-1/2" />

                    <Skeleton className="h-4 w-1/3" />

                    <div className="flex justify-between pt-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-9 w-32" />
                    </div>

                  </CardContent>
                </Card>
              )
            )}

          </div>

        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Page
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Browse Services
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Find the right professional for
            your home service needs.
          </p>

        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-5">

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

              {/* Search */}
              <div className="md:col-span-1">

                <label
                  htmlFor="service-search"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Search
                </label>

                <Input
                  id="service-search"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target
                        .value
                    )
                  }
                />

              </div>

              {/* Category */}
              <div>

                <label
                  htmlFor="category-filter"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category
                </label>

                <select
                  id="category-filter"
                  value={
                    selectedCategory
                  }
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target
                        .value
                    )
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="">
                    All Categories
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.name
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* Sort */}
              <div>

                <label
                  htmlFor="sort-services"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Sort By
                </label>

                <select
                  id="sort-services"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target
                        .value
                    )
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="default">
                    Recommended
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="rating-high">
                    Highest Rated
                  </option>

                  <option value="name-az">
                    Name: A to Z
                  </option>

                  <option value="name-za">
                    Name: Z to A
                  </option>

                </select>

              </div>

            </div>

            {/* Filter Actions */}
            {hasFilters && (
              <div className="mt-4 flex justify-end">

                <Button
                  variant="outline"
                  size="sm"
                  onClick={
                    clearFilters
                  }
                >
                  Clear Filters
                </Button>

              </div>
            )}

          </CardContent>
        </Card>

        {/* Result Count */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-500">

            {sortedServices.length}{" "}
            service
            {sortedServices.length !==
              1
              ? "s"
              : ""}{" "}
            found

          </p>

          {hasFilters && (
            <p className="text-xs text-gray-400">
              Filters applied
            </p>
          )}

        </div>

        {/* Empty State */}
        {sortedServices.length ===
          0 && (
            <Card>
              <CardContent className="py-12 text-center">

                <div className="mx-auto max-w-md">

                  <h2 className="font-semibold text-gray-900">
                    No services found
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Try changing your
                    search or category
                    filter to find
                    available services.
                  </p>

                  {hasFilters && (
                    <Button
                      className="mt-5"
                      variant="outline"
                      onClick={
                        clearFilters
                      }
                    >
                      Clear Filters
                    </Button>
                  )}

                </div>

              </CardContent>
            </Card>
          )}

        {/* Service Cards */}
        {sortedServices.length >
          0 && (
            <div className="space-y-6">

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {currentServices.map(
                  (service) => (
                    <Card
                      key={
                        service.id
                      }
                      className="h-full transition-shadow hover:shadow-md"
                    >

                      <CardHeader className="pb-3">

                        <div className="flex items-start justify-between gap-3">

                          <CardTitle className="min-w-0 text-base font-semibold leading-6 text-gray-900 sm:text-lg">
                            {
                              service.title
                            }
                          </CardTitle>

                          <span className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {
                              service
                                .category
                                .name
                            }
                          </span>

                        </div>

                      </CardHeader>

                      <CardContent className="flex h-full flex-col">

                        {/* Description */}
                        <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                          {
                            service.description
                          }
                        </p>

                        {/* Service Details */}
                        <div className="mt-4 space-y-2 text-sm text-gray-600">

                          <p>
                            <span className="mr-1">
                              📍
                            </span>
                            {
                              service
                                .technician
                                .location
                            }
                          </p>

                          <p>
                            <span className="mr-1">
                              ⭐
                            </span>

                            {Number(
                              service
                                .technician
                                .avgRating
                            ).toFixed(
                              1
                            )}{" "}
                            rating
                          </p>

                        </div>

                        {/* Price */}
                        <div className="mt-4">

                          <p className="text-lg font-bold text-gray-900">
                            $
                            {
                              service.price
                            }
                          </p>

                          <p className="text-xs text-gray-400">
                            Starting price
                          </p>

                        </div>

                        {/* Bottom */}
                        <div className="mt-auto flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">

                          <p className="truncate text-xs text-gray-400">
                            by{" "}
                            {
                              service
                                .technician
                                .user
                                .name
                            }
                          </p>

                          <Button
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() =>
                              router.push(
                                `/technicians/${service.technician.id}`
                              )
                            }
                          >
                            View Technician
                          </Button>

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
                      SERVICES_PER_PAGE,
                      sortedServices.length
                    )}{" "}
                    of{" "}
                    {
                      sortedServices.length
                    }{" "}
                    services

                  </p>

                  {/* Pagination Controls */}
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

                    {/* Pages */}
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

            </div>
          )}

      </div>

    </main>
  );
}