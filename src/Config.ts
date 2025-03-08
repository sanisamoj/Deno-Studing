import { BotApi } from "./data/repository/BotApi.ts";
import { MongodbOperations } from "./mongodb/MongodbOperations.ts"

export abstract class Config {
    public static PORT: number = parseInt(Deno.env.get("PORT") || "8000")
    public static BOT_API_URL: string = Deno.env.get("BOT_API_URL") || ""
    public static SYSTEM_BOT_ID: string = Deno.env.get("BOT_ID") || ""
    public static USER_SECRET_KEY = Deno.env.get("USER_SECRET") as string

    public static initializeSystem() {
        this.initializeDatabase()
        this.initializeBotRepository()
    }

    public static async initializeDatabase() {
        await MongodbOperations.getInstance()
    }

    public static initializeBotRepository() {
        const botApi = BotApi.getInstance()
        botApi.initialize()
    }
}