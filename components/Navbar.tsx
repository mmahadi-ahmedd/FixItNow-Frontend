"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const hideNavbar = ["/auth/login", "/auth/register"].includes(pathname);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const user = await getCurrentUser();
            if (user) {
                setIsLoggedIn(true);
                setRole(user.role);
            }
        };
        checkAuth();
    }, [pathname]);
    if (hideNavbar) return null;
    return (
        <nav className="bg-white border-b px-4 py-3 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="font-bold text-lg">
                    🔧 FixItNow
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/services"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Services
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    if (role === "ADMIN") router.push("/auth/dashboard/admin");
                                    else if (role === "TECHNICIAN") router.push("/auth/dashboard/technician");
                                    else router.push("/auth/dashboard/customer");
                                }}
                            >
                                Dashboard
                            </Button>
                            <Button size="sm" variant="destructive" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <Button size="sm" variant="outline">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button size="sm">Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}