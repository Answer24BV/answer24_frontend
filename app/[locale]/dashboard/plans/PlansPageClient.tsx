"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanCard } from '@/components/plans/PlanCard';
import { PaymentModal } from '@/components/plans/PaymentModal';
import { planService, Plan } from '@/services/planService';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { tokenUtils } from '@/utils/auth';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const userData = tokenUtils.getUser();
    setUser(userData);
    fetchPlans();
    // You might want to fetch user's current plan here
    // setCurrentPlan(userData?.current_plan_id);
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await planService.getPlans();
      setPlans(response.data);
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to fetch plans';
      toast.error(`Error loading plans: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handleProceedToPayment = async (plan: Plan) => {
    try {
      // Integrate with payment system (Mollie, Stripe, etc.)
      toast.success(`Processing payment for ${plan.display_name}...`);
      
      // Example implementation:
      // const paymentUrl = await paymentService.createPayment(plan.id);
      // window.location.href = paymentUrl;
      
      // For demo purposes, simulate payment processing
      setTimeout(() => {
        toast.success('Payment successful! Welcome to your new plan.');
        setIsPaymentModalOpen(false);
        setSelectedPlan(null);
      }, 2000);
      
    } catch (error: any) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. Upgrade or downgrade anytime.
          </p>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PlanCard
                plan={plan}
                userRole={user?.role?.name}
                onSelect={handleSelectPlan}
                isSelected={currentPlan === plan.id}
                showActions={true}
              />
            </motion.div>
          ))}
        </div>

        {plans.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No plans available</p>
            <p className="text-gray-400 mt-2">Please check back later</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Need Help Choosing?</h3>
              <p className="text-gray-600 mb-4">
                Our team is here to help you find the perfect plan for your business needs.
              </p>
              <Button variant="outline" className="cursor-pointer">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        plan={selectedPlan}
        onProceedToPayment={handleProceedToPayment}
      />
    </div>
  );
}