"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Payment was cancelled.");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="text-6xl mb-2">❌</div>
          <CardTitle className="text-red-600">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500">
            Your payment was cancelled. Your booking is still active — you can
            try paying again from your dashboard.
          </p>
          <Button className="w-full" onClick={() => router.push("/auth/dashboard/customer")}>
            Back to Dashboard
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}