import { Participants } from "./Participants.ts";

export interface GroupResponse {
  id: string
  botId: string
  title: string
  imgProfileUrl: string
  participants: Participants[]
  createdAt: string
}