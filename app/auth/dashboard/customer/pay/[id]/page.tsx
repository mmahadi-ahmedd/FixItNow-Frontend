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

      const res = await apiClient.post("/payments/checkout", {
        bookingId: Number(id),
      });

      console.log("checkout response:", res.data);
      const { url } = res.data.data;
      console.log("redirecting to:", url);
      window.location.href = url;

      if (!url) {
        toast.error("Could not create payment session. Please try again.");
        return;
      }

      // await apiClient.post("/payments/test-confirm", {
      //   bookingId: Number(id),
      // });

      toast.success("Payment successful! Booking is now PAID.");
      router.push("/auth/dashboard/customer");
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
            You will be redirected to Stripes secure payment page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">Test Card Details:</p>
            <p>Card: 4242 4242 4242 4242</p>
            <p>Expiry: Any future date (e.g. 12/30)</p>
            <p>CVC: Any 3 digits (e.g. 123)</p>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Booking ID: <strong>#{id}</strong>
          </p>

          <Button className="w-full" onClick={handlePay} disabled={isLoading}>
            {isLoading ? "Redirecting to Stripe..." : "Pay with Stripe"}
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