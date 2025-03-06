export interface BotConfigRequest {
    name?: string
    description?: string
    callPermission: boolean
    automaticCallMessage?: string
    queueRabbitMqPermission: boolean
    queueRabbitMqHandleMessage: string
    queueRabbitMqBotStatus: string
    saveMediaInServer: boolean
}