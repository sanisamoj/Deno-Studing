import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";

export class BotApi {
    private static instance: BotApi | null = null
    private static token: string;

    private customPaginationParams = { page: 1, pageSize: 10 }

    private api = axiod.create({
        baseURL: "http://217.196.60.110:8585",
        timeout: 5000
    });

    private constructor() {}

    public static getInstance(): BotApi {
        if (!this.instance) {
            this.instance = new BotApi()
        }
        return this.instance;
    }

    public setToken(token: string) {
        BotApi.token = token
    }
}
