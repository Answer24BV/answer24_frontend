"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getApiUrl, getApiHeaders } from "@/lib/api-config";
import { tokenUtils } from "@/utils/auth";
import { toast } from "react-toastify";

interface PaymentData {
  id: string;
  status: string;
  amount: {
    value: string;
    currency: string;
  };
  metadata?: {
    plan_id?: string;
    plan_name?: string;
  };
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = window.location.pathname;
  const locale = pathname.split('/')[1] || 'en';
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    processPayment();
  }, []);

  const processPayment = async () => {
    try {
      setIsProcessing(true);

      // Get payment ID from URL params (Mollie sends this back)
      const paymentId = searchParams.get("payment_id") || searchParams.get("id");
      
      console.log("🔍 Payment processing params:", {
        paymentId,
        allParams: Object.fromEntries(searchParams.entries()),
      });

      if (!paymentId) {
        console.warn("⚠️ No payment ID found in URL params");
        setError("No payment ID found. Please contact support if you were charged.");
        setPaymentStatus("failed");
        return;
      }

      const token = tokenUtils.getToken();
      if (!token) {
        console.warn("⚠️ No auth token found");
        setError("Please log in to verify your payment.");
        setPaymentStatus("failed");
        return;
      }

      // Step 1: Verify payment with backend
      console.log("🔍 Verifying payment with backend...");
      const verifyResponse = await fetch(
        getApiUrl(`/payment/verify/${paymentId}`),
        {
          method: "GET",
          headers: getApiHeaders(token),
        }
      );

      if (!verifyResponse.ok) {
        throw new Error(`Payment verification failed: ${verifyResponse.status}`);
      }

      const verifyData = await verifyResponse.json();
      console.log("✅ Payment verification response:", verifyData);
      
      setPaymentData(verifyData);

      // Check if payment is successful
      if (verifyData.status === "paid") {
        setPaymentStatus("success");
        toast.success("Payment successful! Subscription activated! 🎉");
      } else {
        setPaymentStatus("failed");
        setError(`Payment ${verifyData.status}. Please try again.`);
      }

    } catch (err) {
      console.error("❌ Payment processing error:", err);
      setError(err instanceof Error ? err.message : "Failed to process payment");
      setPaymentStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (paymentStatus === "success") {
      // Redirect to billing dashboard with locale
      router.push(`/${locale}/dashboard/account?tab=billing`);
    } else {
      router.push(`/${locale}/pricing`);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
                <p className="text-muted-foreground">
                  Please wait while we verify your payment...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md border-green-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              Payment Successful! 🎉
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Your subscription is now active!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 text-center">
                🎉 Your payment has been processed and your subscription is now active!
              </p>
            </div>
            
            {paymentData && (
              <div className="space-y-2 text-sm">
                {paymentData.metadata?.plan_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{paymentData.metadata.plan_name}</span>
                  </div>
                )}
                {paymentData.amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      {paymentData.amount.currency} {paymentData.amount.value}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600 capitalize">{paymentData.status}</span>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <h3 className="font-semibold text-sm">What's Next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Access all premium features</li>
                <li>✓ Check your billing dashboard</li>
                <li>✓ A confirmation email has been sent</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleContinue}
            >
              Go to Billing Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/${locale}/dashboard`)}
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-700">
              Payment Failed
            </CardTitle>
            <CardDescription className="text-base mt-2">
              We couldn't process your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 text-center">
                {error || "Your payment was not completed. Please try again."}
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="font-semibold text-sm">What can you do?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Check your payment method details</li>
                <li>• Try a different payment method</li>
                <li>• Contact your bank if the problem persists</li>
                <li>• Reach out to our support team for help</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={handleContinue}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/${locale}/dashboard`)}
            >
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return null;
}