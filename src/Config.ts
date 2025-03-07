import { BotLoginRequest } from "./data/models/interfaces/BotLoginRequest.ts";
import { BotTokenResponse } from "./data/models/interfaces/BotTokenResponse.ts";
import { BotApi } from "./data/repository/BotApi.ts";
import { MongodbOperations } from "./mongodb/MongodbOperations.ts"

export abstract class Config {
    public static PORT: number = parseInt(Deno.env.get("PORT") || "8000")
    public static SYSTEM_BOT_ID: string = Deno.env.get("BOT_ID") || ""

    public static initializeSystem() {
        this.initializeDatabase()
        this.initializeBotRepository()
    }

    public static async initializeDatabase() {
        await MongodbOperations.getInstance()
    }

    public static async initializeBotRepository() {
        const botApi = BotApi.getInstance()
        const botLoginRequest: BotLoginRequest = { email: Deno.env.get("BOT_API_EMAIL") || "", password: Deno.env.get("BOT_API_PASSWORD") || "" }
        const botTokenResponse: BotTokenResponse = await botApi.login(botLoginRequest)
        botApi.setToken(botTokenResponse.token)
        console.log("Bot API initialized")
    }
}