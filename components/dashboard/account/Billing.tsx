"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { tokenUtils } from "@/utils/auth";
import { Loader2, CreditCard, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface SubscriptionData {
  plan_name?: string;
  credits_used?: number;
  credits_total?: number;
  renewal_date?: string;
  status?: string;
  is_active?: boolean;
}

export function Billing() {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  const subscriptionEndpoint =
    "https://staging.answer24.nl/api/v1/subscription/details";

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = tokenUtils.getToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(subscriptionEndpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Subscription data:", data);

      setSubscriptionData(data.data || data);

      // Check if user has an active subscription
      const isActive = data.data?.is_active || data.is_active;
      setHasActivePlan(isActive === true);
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch subscription data"
      );
      setHasActivePlan(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading billing information...</span>
      </div>
    );
  }

  // No active plan state
  if (!hasActivePlan && !error) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <CreditCard className="h-8 w-8 text-gray-600" />
            </div>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You haven't subscribed to any plan yet. Choose a plan to get
              started with Answer24.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to unlock AI-powered features and start your journey
              with us.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/pricing">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Choose a Plan
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Questions about our plans or pricing? We're here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Contact our support team if you have any questions about choosing
              the right plan for your needs.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Contact Support</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Calculate progress percentage for active subscriptions
  const progressValue = subscriptionData?.credits_total
    ? ((subscriptionData.credits_used || 0) / subscriptionData.credits_total) *
      100
    : 0;

  // Active subscription state
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the{" "}
            <strong>{subscriptionData?.plan_name || "Growth"}</strong> plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">Error: {error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSubscriptionData}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Monthly AI Credits</p>
                <p className="text-sm">
                  {subscriptionData?.credits_used || 0}/
                  {subscriptionData?.credits_total || 100}
                </p>
              </div>
              <Progress value={progressValue} />
              <p className="text-xs text-gray-500">
                Your credits will reset on{" "}
                {subscriptionData?.renewal_date || "August 1, 2025"}.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/pricing">
            <Button variant="outline">Change Plan</Button>
          </Link>
          <Button variant="destructive">Cancel Subscription</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Update your billing details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
            <div>
              <p className="font-medium">Mastercard **** 4444</p>
              <p className="text-sm text-gray-500">Expires 12/2028</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Update Payment Method</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">July 2025</p>
                <p className="text-sm text-gray-500">Invoice #INV-00123</p>
              </div>
              <Button variant="outline">Download</Button>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium">June 2025</p>
                <p className="text-sm text-gray-500">Invoice #INV-00122</p>
              </div>
              <Button variant="outline">Download</Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
