"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Shield, Zap, Euro, Loader2 } from "lucide-react";
import { apiRequest } from "@/utils/auth";
const AddMoney = ({ handleClose }: { handleClose: () => void }) => {
  const [amount, setAmount] = useState(0);
  const ref = useRef<HTMLFormElement>(null);
  const [loader, setLoader] = useState(false);

  const handleAddMoney = async (e: FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setLoader(true);

    try {
      // Extract locale from current URL
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      const locale = pathname.split('/')[1] || 'en';

      const requestPayload = {
        amount: amount,
        redirect_url: `${window.location.origin}/${locale}/payment/success`,
        webhook_url: `${window.location.origin}/api/payment/webhook`,
      };

      console.log("🚀 Starting wallet deposit process:", {
        amount,
        locale,
        redirect_url: requestPayload.redirect_url,
        webhook_url: requestPayload.webhook_url,
        fullUrl: window.location.href,
      });

      const response = await apiRequest("/wallet/deposit", {
        method: "POST",
        body: JSON.stringify(requestPayload),
      });

      console.log("📥 Deposit response:", response);

      // Check if response contains checkout_url
      if (response.data && response.data.checkout_url) {
        // Store payment ID for later retrieval (in case Mollie doesn't include it in redirect URL)
        if (response.data.payment_id) {
          localStorage.setItem('mollie_payment_id', response.data.payment_id);
          sessionStorage.setItem('mollie_payment_id', response.data.payment_id);
        }
        
        // Store amount for wallet deposit
        localStorage.setItem('wallet_deposit_amount', amount.toString());
        sessionStorage.setItem('wallet_deposit_amount', amount.toString());
        
        console.log("🌐 Redirecting to Mollie checkout:", response.data.checkout_url);
        // Redirect to Mollie checkout URL to complete payment
        window.location.href = response.data.checkout_url;
      } else {
        toast.success(`Successfully added €${amount} to your wallet!`);
        handleClose();
      }
    } catch (error: any) {
      console.error("Deposit error:", error);
      toast.error(
        error.message || "Failed to add money to wallet. Please try again."
      );
    } finally {
      setLoader(false);
    }
  };

  const quickAmounts = [25, 50, 100, 200];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [handleClose]);

  useEffect(() => {
    // Add CSS to hide scrollbar
    const style = document.createElement("style");
    style.textContent = `
            .modal-scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .modal-scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-black/50 fixed bg-opacity-50 backdrop-blur-sm top-0 left-0 w-full h-full flex flex-col justify-center overflow-hidden z-50">
      <form
        ref={ref}
        onSubmit={handleAddMoney}
        className="bg-white mx-auto w-11/12 sm:w-10/12 lg:w-6/12 xl:w-5/12 text-black py-8 rounded-2xl px-6 flex flex-col gap-6 max-h-[85vh] overflow-y-auto shadow-2xl modal-scrollbar-hide"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            Add Money to Wallet
          </h3>
        </div>

        {/* Amount Selection */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-700">
            Select Amount
          </label>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => handleQuickAmount(quickAmount)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  amount === quickAmount
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <div className="text-lg font-semibold">€{quickAmount}</div>
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Euro className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              className="w-full pl-12 pr-4 py-4 border-0 border-b-2 pb-2 outline-none bg-transparent text-[#27272a] placeholder:text-[#27272a] focus:outline-none focus:ring-0 border-blue-500 focus:border-blue-500 dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-500 text-xl font-semibold text-center"
              value={amount !== 0 ? amount : ""}
              placeholder="0.00"
              min={0}
              step="0.01"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={amount <= 0 || loader}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loader ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Add Money</span>
              </div>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 pt-2">
          <div className="flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Your payment is secured with bank-level encryption</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMoney;
