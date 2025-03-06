import { MongodbOperations } from "./mongodb/MongodbOperations.ts"

export abstract class Config {
    public static PORT: number = parseInt(Deno.env.get("PORT") || "8000")

    public static async initializeDatabase() {
        await MongodbOperations.getInstance()
    }
}