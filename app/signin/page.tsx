"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Key } from "lucide-react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left: Marketing */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[#0a0a23] p-10 text-white">
          <div className="flex items-center mb-8">
            <Image src="/globe.svg" alt="Logo" width={40} height={40} />
            <span className="ml-3 text-2xl font-bold">adsby</span>
          </div>
          <div className="mb-4 text-lg font-medium opacity-80">Weekly Optimization</div>
          <h2 className="text-3xl font-bold mb-2 text-white">Weekly Optimization<br/>with <span className="text-teal-300">No Hassle!</span></h2>
          <p className="mb-8 text-base opacity-80 text-center">Include the Search Terms recommended by AI within the scope of your campaign.</p>
          <Image src="/image.png" alt="Optimize your campaign" width={260} height={160} className="rounded-xl shadow" />
        </div>
        {/* Right: Sign In Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-end mb-4">
            <div className="border rounded-lg px-3 py-1 flex items-center text-sm text-gray-700 cursor-pointer">
              <Image src="https://flagcdn.com/gb.svg" alt="English" width={20} height={14} className="mr-2 rounded-sm" />
              English
            </div>
          </div>
          <div className="w-full max-w-md mx-auto">
            <Button variant="outline" className="w-full flex items-center justify-center mb-6">
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="mr-2" />
              Sign in with Google
            </Button>
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="mx-4 text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <form className="space-y-4">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <span className="absolute left-3 top-9 text-gray-400"><Mail size={18} /></span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <span className="absolute left-3 top-9 text-gray-400"><Key size={18} /></span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="********"
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex items-center justify-end">
                <Link href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
              </div>
              <Button type="submit" className="w-full bg-emerald-400 hover:bg-emerald-500 text-white text-base font-semibold py-2 rounded-md">Sign In</Button>
            </form>
            <div className="text-center text-sm text-gray-600 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="#" className="text-yellow-600 font-semibold underline">Start Your 7-day Free Trial</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 