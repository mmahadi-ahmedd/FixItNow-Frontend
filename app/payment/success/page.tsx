"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    toast.success("Payment completed successfully!");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="text-6xl mb-2">✅</div>
          <CardTitle className="text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500">
            Your payment has been processed successfully. The technician will
            start your job soon.
          </p>
          <Button className="w-full" onClick={() => router.push("/auth/dashboard/customer")}>
            View My Bookings
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}