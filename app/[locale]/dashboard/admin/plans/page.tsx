"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanCard } from "@/components/plans/PlanCard";
import { PlanForm } from "@/components/plans/PlanForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { planService, Plan, CreatePlanData } from "@/services/planService";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { tokenUtils } from "@/utils/auth";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const userData = tokenUtils.getUser();
    setUser(userData);
    fetchPlans();
  }, []);

  useEffect(() => {
    const filtered = plans.filter(
      (plan) =>
        plan.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlans(filtered);
  }, [plans, searchTerm]);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await planService.getPlans();
      setPlans(response.data);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to fetch plans";
      toast.error(`Fetch Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = async (data: CreatePlanData) => {
    try {
      setIsSubmitting(true);
      const response = await planService.createPlan(data);
      setPlans((prev) => [...prev, response.data]);
      setShowForm(false);
      toast.success("Plan created successfully");
    } catch (error: any) {
      console.error("Error creating plan:", error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to create plan";
      toast.error(`Create Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePlan = async (data: CreatePlanData) => {
    if (!editingPlan) return;

    try {
      setIsSubmitting(true);
      const response = await planService.updatePlan(editingPlan.id, data);
      setPlans((prev) =>
        prev.map((plan) => (plan.id === editingPlan.id ? response.data : plan))
      );
      setEditingPlan(null);
      setShowForm(false);
      toast.success("Plan updated successfully");
    } catch (error: any) {
      console.error("Error updating plan:", error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update plan";
      toast.error(`Update Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setPlanToDelete(plan);
      setShowDeleteDialog(true);
    }
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      setIsDeleting(true);
      console.log("Attempting to delete plan with ID:", planToDelete.id);
      await planService.deletePlan(planToDelete.id);
      setPlans((prev) => prev.filter((plan) => plan.id !== planToDelete.id));
      toast.success(`Plan "${planToDelete.display_name}" deleted successfully`);
      console.log("Plan deleted successfully:", planToDelete.id);
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to delete plan";
      toast.error(`Delete Error: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setPlanToDelete(null);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPlan(null);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Plan Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage subscription plans for clients and partners
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Edit Plan" : "Create New Plan"}
              </DialogTitle>
              <DialogDescription>
                {editingPlan
                  ? "Update the plan details below."
                  : "Fill in the details to create a new subscription plan."}
              </DialogDescription>
            </DialogHeader>
            <PlanForm
              plan={editingPlan || undefined}
              onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Plan"
          description={
            planToDelete
              ? `Are you sure you want to delete "${planToDelete.display_name}"? This action cannot be undone and will affect all users currently subscribed to this plan.`
              : "Are you sure you want to delete this plan?"
          }
          confirmText="Delete Plan"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmDeletePlan}
          isLoading={isDeleting}
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                placeholder="Search plans by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PlanCard
                plan={plan}
                userRole="admin"
                onEdit={handleEdit}
                onDelete={handleDeletePlan}
                showActions={true}
              />
            </motion.div>
          ))}
        </div>

        {filteredPlans.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No plans found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create your first plan to get started"}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
