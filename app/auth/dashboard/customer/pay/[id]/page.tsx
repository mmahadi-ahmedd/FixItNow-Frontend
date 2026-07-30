"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiClient, getErrorMessage } from "@/lib/api-client";

export default function PayPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.post("/payments/create", {
        bookingId: Number(id),
      });

      const { paymentIntentId, clientSecret, amount } = res.data.data;

      const confirmRes = await apiClient.post("/payments/confirm", {
        bookingId: Number(id),
      });

      if (confirmRes.data.success) {
        toast.success("Payment successful! Booking is now PAID.");
        router.push("/auth/dashboard/customer");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>
            Your booking has been accepted. Complete payment to confirm your job.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Booking ID: <strong>#{id}</strong>
          </p>
          <Button
            className="w-full"
            onClick={handlePay}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Pay with Stripe"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}