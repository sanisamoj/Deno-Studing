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

    public static initializeBotRepository() {
        const botApi = BotApi.getInstance()
        botApi.initialize()
    }
}