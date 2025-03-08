export interface SendMessageRequest {
    botId: string
    userId?: string
    phone: string
    message: string
    imageUrl?: string
}