"use client";

import { useState, useEffect } from "react";
import { Check, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { tokenUtils } from "@/utils/auth";
import { PaymentModal } from "@/components/plans/PaymentModal";

interface PricingTier {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price: string;
  formatted_price: string;
  duration_days: number;
  features: string[];
  color: string;
  created_at: string;
  updated_at: string;
  // UI-specific fields we'll add
  is_popular?: boolean;
  button_text?: string;
  gradient?: string;
  text_color?: string;
}

interface ApiResponse {
  success: boolean;
  data: PricingTier[];
  message?: string;
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingTier | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const router = useRouter();

  const pricingEndpoint = "https://answer24.laravel.cloud/api/v1/plan";

  const fetchPricingData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(pricingEndpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log("Pricing data:", data);

      if (data.success && data.data) {
        // Map API data to our component format and add UI styling
        const formattedTiers = data.data.map((tier, index) => ({
          ...tier,
          features: Array.isArray(tier.features) ? tier.features : [],
          button_text: tier.button_text || getDefaultButtonText(tier.name),
          gradient: getGradientForPlan(index),
          text_color: getTextColorForPlan(index),
          is_popular: tier.name === "starter", // Mark starter as popular, adjust as needed
        }));

        setPricingTiers(formattedTiers);
      } else {
        throw new Error(data.message || "Failed to fetch pricing data");
      }
    } catch (err) {
      console.error("Error fetching pricing data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch pricing data"
      );

      // Fallback to hardcoded data if API fails
      setPricingTiers(getFallbackPricingData());
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getDefaultButtonText = (planName: string): string => {
    // Check if user is authenticated
    const token = tokenUtils.getToken();
    const isAuthenticated = !!token;

    const name = planName.toLowerCase();

    if (!isAuthenticated) {
      // Not logged in - encourage signup
      if (name.includes("basic")) return "Get Started";
      if (name.includes("starter")) return "Start Free Trial";
      if (name.includes("creator")) return "Choose Plan";
      if (name.includes("enterprise")) return "Contact Sales";
      return "Sign Up";
    } else {
      // Logged in - encourage purchase
      if (name.includes("enterprise")) return "Contact Sales";
      return "Subscribe Now";
    }
  };

  const getGradientForPlan = (index: number): string => {
    const gradients = [
      "from-blue-400 to-cyan-300",
      "from-purple-500 to-pink-500",
      "from-emerald-400 to-teal-400",
      "from-orange-400 to-red-400",
      "from-indigo-400 to-purple-400",
    ];
    return gradients[index % gradients.length];
  };

  const getTextColorForPlan = (index: number): string => {
    const colors = [
      "text-blue-900",
      "text-white",
      "text-emerald-900",
      "text-orange-900",
      "text-indigo-900",
    ];
    return colors[index % colors.length];
  };

  const getFallbackPricingData = (): PricingTier[] => [
    {
      id: "basic",
      name: "basic",
      display_name: "Basic Plan",
      description: "Perfect for individual real estate agents",
      price: "29.99",
      formatted_price: "€29.99",
      duration_days: 30,
      features: [
        "Up to 50 leads per month",
        "Basic AI conversation flow",
        "Email notifications",
        "Standard property matching",
        "Basic reporting",
      ],
      color: "#000000",
      created_at: "",
      updated_at: "",
      is_popular: false,
      button_text: "Get Started",
      gradient: "from-blue-400 to-cyan-300",
      text_color: "text-blue-900",
    },
    {
      id: "starter",
      name: "starter",
      display_name: "Starter Plan",
      description: "Ideal for growing agencies with enhanced AI capabilities",
      price: "79.99",
      formatted_price: "€79.99",
      duration_days: 30,
      features: [
        "Up to 200 leads per month",
        "Advanced AI conversation flow",
        "WhatsApp + Email notifications",
        "Smart property matching",
        "Team collaboration (3 users)",
        "Advanced reporting & analytics",
        "Custom AI response templates",
      ],
      color: "#000000",
      created_at: "",
      updated_at: "",
      is_popular: true,
      button_text: "Start Free Trial",
      gradient: "from-purple-500 to-pink-500",
      text_color: "text-white",
    },
    {
      id: "enterprise",
      name: "enterprise",
      display_name: "Enterprise Plan",
      description: "Custom solution for large agencies",
      price: "299.99",
      formatted_price: "€299.99",
      duration_days: 30,
      features: [
        "Unlimited leads",
        "Custom AI conversation flows",
        "All notification channels",
        "Advanced AI lead qualification",
        "Unlimited team members",
        "Full white-label solution",
        "Dedicated account manager",
        "Custom API access",
      ],
      color: "#000000",
      created_at: "",
      updated_at: "",
      is_popular: false,
      button_text: "Contact Sales",
      gradient: "from-emerald-400 to-teal-400",
      text_color: "text-emerald-900",
    },
  ];

  const handlePlanSelection = (tier: PricingTier) => {
    // Check if user is authenticated
    const token = tokenUtils.getToken();
    const isAuthenticated = !!token;

    if (isAuthenticated) {
      // User is logged in - show payment modal
      setSelectedPlan(tier);
      setShowPaymentModal(true);
    } else {
      // User not logged in - go to signup with plan pre-selected
      const planData = {
        planId: tier.id,
        planName: tier.name,
        displayName: tier.display_name,
        price: parseFloat(tier.price),
        formattedPrice: tier.formatted_price,
        durationDays: tier.duration_days,
      };
      localStorage.setItem("selectedPlan", JSON.stringify(planData));
      router.push(`/partner-signup?plan=${tier.id}`);
    }
  };

  const handleProceedToPayment = async (plan: PricingTier) => {
    // This will be called after successful payment
    console.log("Payment completed for plan:", plan.display_name);
    setShowPaymentModal(false);
    // Redirect to dashboard/billing to see active subscription
    router.push("/dashboard/billing");
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  useEffect(() => {
    fetchPricingData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Loading pricing plans...
          </p>
        </div>
      </div>
    );
  }

  if (error && pricingTiers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Pricing</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchPricingData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade at any
            time.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm">
                ⚠️ Using fallback pricing data. Some information may not be
                current.
              </p>
            </div>
          )}

          {/* Billing Toggle - Hide since API only has monthly pricing */}
          {/* <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={cn(
                "text-sm font-medium",
                !isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span
              className={cn(
                "text-sm font-medium",
                isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div> */}
        </div>

        {/* Pricing Cards */}
        <div
          className={`grid md:grid-cols-${Math.min(
            pricingTiers.length,
            3
          )} gap-8 max-w-5xl mx-auto`}
        >
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.id}
              className={cn(
                `bg-gradient-to-br ${tier.gradient} relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`,
                tier.is_popular &&
                  `border-2 border-purple-500 shadow-xl scale-[1.02]`
              )}
            >
              {tier.is_popular && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-200 to-pink-200 text-black px-3 py-1 flex items-center gap-1 shadow-md">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4 relative">
                <CardTitle
                  className={`text-2xl font-bold relative ${tier.text_color} drop-shadow-sm`}
                >
                  {tier.display_name || tier.name}
                </CardTitle>
                <CardDescription className="text-foreground/80 font-medium">
                  {tier.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span
                      className={`text-4xl font-bold ${tier.text_color} drop-shadow-sm`}
                    >
                      {tier.formatted_price}
                    </span>
                    <span className="text-foreground/80 ml-1 font-medium">
                      /month
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 mt-1 font-medium">
                    Billed every {tier.duration_days} days
                  </p>
                </div>
              </CardHeader>

              <CardContent className="relative">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`h-5 w-5 ${tier.text_color} mt-0.5 flex-shrink-0`}
                      />
                      <span className="text-sm text-foreground font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="relative">
                <Button
                  className="w-full relative z-10 transition-all duration-300 hover:scale-105"
                  variant={tier.is_popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => handlePlanSelection(tier)}
                >
                  {tier.button_text}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">
                Can I change plans anytime?
              </h4>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-700">
                Is there a free trial?
              </h4>
              <p className="text-muted-foreground text-sm">
                Yes, we offer a 14-day free trial for the Professional plan. No
                credit card required.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">
                What payment methods do you accept?
              </h4>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and bank transfers for
                Enterprise plans.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-700">
                Can I cancel anytime?
              </h4>
              <p className="text-muted-foreground text-sm">
                Absolutely. You can cancel your subscription at any time with no
                cancellation fees.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border border-blue-200 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 to-purple-200/40 -z-0" />
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ready to get started?
          </h3>
          <p className="text-foreground/80 mb-6 max-w-2xl mx-auto font-medium">
            Join thousands of satisfied customers who trust our platform for
            their business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button
              size="lg"
              className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all duration-300"
              onClick={() => router.push("/partner-signup")}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all duration-300"
              onClick={() => router.push("/partner-signup")}
            >
              Contact Sales
            </Button>
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          plan={selectedPlan}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
    </div>
  );
}
