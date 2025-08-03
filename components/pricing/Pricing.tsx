"use client"

import { useState } from "react"
import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useRouter } from "@/i18n/navigation"

interface PricingTier {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  popular?: boolean
  buttonText: string
  buttonVariant: "default" | "outline"
  gradient?: string
  textColor?: string
  bg?: string
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    description: "Perfect for individuals and small projects",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: ["Up to 5 projects", "10GB storage", "Basic support", "Standard templates", "Mobile app access"],
    buttonText: "Get Started",
    buttonVariant: "outline",
    gradient: "from-blue-400 to-cyan-300",
    textColor: "text-blue-900"
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses and teams",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Unlimited projects",
      "100GB storage",
      "Priority support",
      "Premium templates",
      "Advanced analytics",
      "Team collaboration",
      "Custom integrations",
    ],
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default",
    gradient: "from-purple-500 to-pink-500",
    textColor: "text-white",
    bg: "bg-red-400"
  },
  {
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "Everything in Professional",
      "Unlimited storage",
      "24/7 dedicated support",
      "Custom templates",
      "Advanced security",
      "SSO integration",
      "API access",
      "Custom onboarding",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    gradient: "from-emerald-400 to-teal-400",
    textColor: "text-emerald-900",
    bg: "bg-red-400"
  },
]

const gradient = [
  "from-blue-400 to-cyan-300",
  "from-purple-500 to-pink-500",
  "from-emerald-400 to-teal-400"
]

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={cn("text-sm font-medium", !isYearly ? "text-foreground" : "text-muted-foreground")}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-primary" />
            <span className={cn("text-sm font-medium", isYearly ? "text-foreground" : "text-muted-foreground")}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className={`grid md:grid-cols-3 gap-8 max-w-5xl mx-auto`}>
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.name}
              className={cn(
                `bg-gradient-to-br ${tier.gradient} relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`,
                tier.popular && `border-2 border-purple-500  shadow-xl scale-[1.02]`,
              )}
            >
              {tier.popular && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-200 to-pink-200 text-black px-3 py-1 flex items-center gap-1 shadow-md">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb- relative">
                {/* <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-25`} /> */}
                <CardTitle className={`text-2xl font-bold relative ${tier.textColor} drop-shadow-sm`}>{tier.name}</CardTitle>
                <CardDescription className="text-foreground/80 font-medium">{tier.description}</CardDescription>
                <div className="mt-">
                  <div className="flex items-baseline justify-center">
                    <span className={`text-4xl font-bold ${tier.textColor} drop-shadow-sm`}>${isYearly ? tier.yearlyPrice : tier.monthlyPrice}</span>
                    <span className="text-foreground/80 ml-1 font-medium">/{isYearly ? "year" : "month"}</span>
                  </div>
                  {isYearly && (
                    <p className="text-sm text-foreground/80 mt-1 font-medium">
                      ${Math.round(tier.yearlyPrice / 12)}/month billed annually
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="relative">
                {/* <div className={`absolute inset-0 bg-gradient-to-b ${tier.gradient} opacity-20`} /> */}
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 ${tier.textColor} mt-0.5 flex-shrink-0`} />
                      <span className="text-sm text-foreground font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="relative">
                {/* <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-15`} /> */}
                <Button 
                  className="w-full relative z-10 transition-all duration-300 hover:scale-105" 
                  variant={tier.buttonVariant} 
                  size="lg"
                  onClick={() => router.push('/partner-signup')}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">Can I change plans anytime?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing
                cycle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-700">Is there a free trial?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, we offer a 14-day free trial for the Professional plan. No credit card required.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">What payment methods do you accept?</h4>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-700">Can I cancel anytime?</h4>
              <p className="text-muted-foreground text-sm">
                Absolutely. You can cancel your subscription at any time with no cancellation fees.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border border-blue-200 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 to-purple-200/40 -z-0" />
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ready to get started?</h3>
          <p className="text-foreground/80 mb-6 max-w-2xl mx-auto font-medium">
            Join thousands of satisfied customers who trust our platform for their business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button 
            size="lg" 
            className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all duration-300"
            onClick={() => router.push('/partner-signup')}
          >
            Start Free Trial
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all duration-300"
            onClick={() => router.push('/partner-signup')}
          >
            Contact Sales
          </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
