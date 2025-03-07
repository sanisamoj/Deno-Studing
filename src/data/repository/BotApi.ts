import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";
import { LoginRequest } from "../models/interfaces/LoginRequest.ts";
import { BotTokenResponse } from "../models/interfaces/BotTokenResponse.ts";
import { BotResponse } from "../models/interfaces/BotResponse.ts";
import { MessageToSend } from "../models/interfaces/MessageToSend.ts";
import { BotLoginRequest } from "../models/interfaces/BotLoginRequest.ts";
import { Infos } from "../models/types/Infos.ts";

export class BotApi {
    private static instance: BotApi | null = null
    private static token: string;

    private customPaginationParams = { page: 1, pageSize: 10 }

    private api = axiod.create({
        baseURL: "http://localhost:8585",
        timeout: 5000
    });

    private constructor() { }

    public static getInstance(): BotApi {
        if (!this.instance) {
            this.instance = new BotApi()
        }
        return this.instance;
    }

    public setToken(token: string) {
        BotApi.token = token
    }

    public async initialize(attempt: number = 0) {
        const maxAttempts = 7
        const delay = 30000

        try {
            const botLoginRequest: BotLoginRequest = { email: Deno.env.get("BOT_API_EMAIL") || "", password: Deno.env.get("BOT_API_PASSWORD") || "" }
            const response = await this.api.post<BotTokenResponse>("/admin", botLoginRequest)
            BotApi.token = response.data.token
            console.log(Infos.BotApiInitialized)
        } catch (_error: unknown) {
            if (attempt < maxAttempts) {
                console.log(`${Infos.BotApiInitializationFailed} | Attempt ${attempt + 1}/${maxAttempts}`)
                setTimeout(() => this.initialize(attempt + 1), delay)
            } else {
                console.error(Infos.BotApiInitializationFailed)
            }
        }
    }

    public async login(loginRequest: LoginRequest): Promise<BotTokenResponse> {
        const response = await this.api.post<BotTokenResponse>("/admin", loginRequest)
        return response.data
    }

    public async getBot(botId: string): Promise<BotResponse> {
        const response = await this.api.get<BotResponse>(`/bot/${botId}`, { headers: { Authorization: `Bearer ${BotApi.token}` } })
        return response.data
    }

    public async deleteBot(botId: string): Promise<void> {
        await this.api.delete(`/bot/${botId}`, { headers: { Authorization: `Bearer ${BotApi.token}` } })
    }

    public async sendMessage(botId: string, messageToSend: MessageToSend): Promise<void> {
        await this.api.post(`/bot/${botId}/message`, messageToSend, { headers: { Authorization: `Bearer ${BotApi.token}` } })
    }

    public async stopBot(botId: string): Promise<void> {
        await this.api.post(`/bot/${botId}/stop`, {}, { headers: { Authorization: `Bearer ${BotApi.token}` } })
    }

    public async restartBot(botId: string): Promise<void> {
        await this.api.post(`/bot/${botId}/restart`, {}, { headers: { Authorization: `Bearer ${BotApi.token}` } })
    }
}
