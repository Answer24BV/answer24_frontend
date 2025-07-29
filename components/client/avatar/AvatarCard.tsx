"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Avatar, SubscriptionPlan } from "@/types/avatar"
import { AvatarModal } from "./AvatarModal"
import { isAvatarLocked } from "@/lib/utils"

interface AvatarCardProps {
  avatar: Avatar
  userPlan: SubscriptionPlan
  className?: string
}

export function AvatarCard({ avatar, userPlan, className }: AvatarCardProps) {
  const locked = isAvatarLocked(userPlan, avatar.requiredPlan)

  return (
    <AvatarModal avatar={avatar} userPlan={userPlan}>
      <Card
        className={cn(
          "flex flex-col items-center p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-lg",
          locked && "grayscale opacity-50 hover:opacity-75",
          className
        )}
      >
        <CardContent className="p-0 flex flex-col items-center">
          <Image
            src={avatar.image || "/placeholder.svg"}
            alt={avatar.name}
            width={80}
            height={80}
            className="rounded-full object-cover mb-3"
          />
          <h3 className="font-semibold text-lg">{avatar.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{avatar.role}</p>
        </CardContent>
      </Card>
    </AvatarModal>
  )
}
