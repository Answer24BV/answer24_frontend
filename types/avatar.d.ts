export type SubscriptionPlan = "small" | "medium" | "big"

export interface Avatar {
  id: string
  name: string
  role: string
  functions: string[]
  image: string
  requiredPlan: SubscriptionPlan
  description?: string
}
