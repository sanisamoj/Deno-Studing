import { Context, Hono } from "hono";
import { Variables } from "../main.ts";
import { Config } from "../Config.ts";
import { jwt } from "hono/jwt";
import { BotCreateRequest } from "../data/models/interfaces/BotCreateRequest.ts";
import { BotService } from "../services/bot/BotService.ts";
import { BotResponse } from "../data/models/interfaces/BotResponse.ts";

export const botRouting = new Hono<{ Variables: Variables }>()
const jwtMiddleware = jwt({
    secret: Config.USER_SECRET_KEY,
})

botRouting.use("/*", jwtMiddleware)

botRouting
    .post("/", async (context: Context) => {
        const payload = context.get('jwtPayload')
        const request: BotCreateRequest = await context.req.json()
        request.userId = payload.id
        const response: BotResponse = await new BotService().createBot(request)
        return context.json(response)
    })
    .get("/:id?", async (context: Context) => {
        const payload = context.get('jwtPayload')
        const { id } = context.req.query()

        if (id) return context.json(await new BotService().findBotById(id))

        const response: BotResponse[] = await new BotService().getAllBotsFromTheUser(payload.id)
        return context.json(response)
    })
    .delete("/:id?", async (context: Context) => {
        const payload = context.get('jwtPayload')
        const { id } = context.req.query()
        await new BotService().deleteBot(payload.id, id)
        return context.newResponse(null, 200)
    })