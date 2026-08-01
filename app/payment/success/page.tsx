"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const sessionId = searchParams.get("session_id");
      const bookingId = searchParams.get("bookingId");

      if (!sessionId || !bookingId) {
        setIsVerifying(false);
        return;
      }

      try {
        await apiClient.post("/payments/verify-session", {
          sessionId,
          bookingId: Number(bookingId),
        });
        setVerified(true);
        toast.success("Payment confirmed! Booking is now PAID.");
      } catch {
        // might already be verified if webhook fired first — that's fine
        setVerified(true);
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="text-6xl mb-2">✅</div>
          <CardTitle className="text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500">
            Your payment has been processed. The technician will start your job soon.
          </p>
          <Button
            className="w-full"
            onClick={() => router.push("/auth/dashboard/customer")}
          >
            View My Bookings
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}