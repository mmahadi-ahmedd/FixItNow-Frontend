"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Wrench, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUser, logout, type CurrentUser } from "@/lib/auth";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const customerLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Dashboard", href: "/auth/dashboard/customer" },
  { label: "My Bookings", href: "/auth/profile/customer/bookings" },
  { label: "About", href: "/about" },
];

const technicianLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Dashboard", href: "/auth/dashboard/technician" },
  { label: "My Services", href: "/auth/profile/technician/services" },
  { label: "About", href: "/about" },
];

const adminLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/auth/dashboard/admin" },
  { label: "Users", href: "/auth/profile/admin/users" },
  { label: "Categories", href: "/auth/profile/admin/categories" },
  { label: "Bookings", href: "/auth/profile/admin/bookings" },
  { label: "Services", href: "/services" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hideNavbar = ["/auth/login", "/auth/register"].includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (hideNavbar) return null;

  const getLinks = () => {
    if (!user) return publicLinks;
    if (user.role === "CUSTOMER") return customerLinks;
    if (user.role === "TECHNICIAN") return technicianLinks;
    if (user.role === "ADMIN") return adminLinks;
    return publicLinks;
  };

  const links = getLinks();

  const getDashboardPath = () => {
    if (!user) return "/auth/login";
    return `/auth/dashboard/${user.role.toLowerCase()}`;
  };
  const getProfilePath = () => {
    if (!user) return "/auth/login";
    return `/auth/profile/${user.role.toLowerCase()}`;
  };


  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-gray-900 shadow-md"
          : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Wrench className="h-6 w-6 text-blue-600" />
            <span>FixItNow</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === link.href
                    ? "text-blue-600"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />  
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden lg:block">
                      {user.name}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mt-1 inline-block">
                      {user.role}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(getDashboardPath())}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/auth/dashboard/${user.role.toLowerCase()}/profile`)}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger>
                <button className="p-2 rounded-md text-gray-600 hover:text-gray-900">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col h-full">

                  {/* Mobile Header */}
                  <div className="flex items-center gap-2 p-4 border-b">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <span className="font-bold">FixItNow</span>
                  </div>
                   <ThemeToggle /> 

                  {/* Mobile User Info */}
                  {user && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mobile Links */}
                  <div className="flex flex-col py-2 flex-1">
                    {links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          pathname === link.href
                            ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Bottom Actions */}
                  <div className="p-4 border-t space-y-2">
                    {user ? (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                      >
                        Logout
                      </Button>
                    ) : (
                      <>
                        <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">Login</Button>
                        </Link>
                        <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Register
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>

                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </nav>
  );
}