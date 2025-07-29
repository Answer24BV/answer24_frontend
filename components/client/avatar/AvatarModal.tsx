"use client"

import type React from "react"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Avatar, SubscriptionPlan } from "@/types/avatar"
import { isAvatarLocked } from "@/lib/utils"

interface AvatarModalProps {
  avatar: Avatar
  userPlan: SubscriptionPlan
  children: React.ReactNode
}

export function AvatarModal({ avatar, userPlan, children }: AvatarModalProps) {
  const locked = isAvatarLocked(userPlan, avatar.requiredPlan)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{avatar.name}</DialogTitle>
          <DialogDescription>{avatar.role}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <Image
              src={avatar.image || "/placeholder.svg"}
              alt={avatar.name}
              width={150}
              height={150}
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Functions:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {avatar.functions.map((func, index) => (
                <li key={index}>{func}</li>
              ))}
            </ul>
          </div>
          {locked && (
            <div className="text-center mt-4">
              <p className="text-red-500 mb-2">This avatar requires the {avatar.requiredPlan} plan.</p>
              <Button className="w-full" onClick={() => alert("Redirecting to upgrade flow...")}>
                Upgrade now
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
