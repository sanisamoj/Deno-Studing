import { TreatmentStatus } from "../types/TreatmentStatus.ts";

export interface ContactResponse {
  imageUrl?: string
  contactName?: string
  phone: string
  lastInteraction: string
  collected: Record<string, string>[]
  status: TreatmentStatus
  firstInteraction: string
}