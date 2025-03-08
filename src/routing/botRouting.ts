import { Context, Hono } from "hono";
import { Variables } from "../main.ts";
import { Config } from "../Config.ts";
import { jwt } from "hono/jwt";
import { BotCreateRequest } from "../data/models/interfaces/BotCreateRequest.ts";
import { BotService } from "../services/bot/BotService.ts";
import { BotResponse } from "../data/models/interfaces/BotResponse.ts";
import { BotHandlerService } from "../services/bot/BotHandlerService.ts";
import { BotTokenResponse } from "../data/models/interfaces/BotTokenResponse.ts";
import { MessageToSend } from "../data/models/interfaces/MessageToSend.ts";
import { SendMessageRequest } from "../data/models/interfaces/SendMessageRequest.ts";

export const botRouting = new Hono<{ Variables: Variables }>()
const jwtMiddleware = jwt({
    secret: Config.USER_SECRET_KEY,
})

const botJwtMiddleware = jwt({
    secret: Config.BOT_SECRET_KEY
})

botRouting
    .post("/", jwtMiddleware, async (context: Context) => {
        const payload = context.get('jwtPayload')
        const request: BotCreateRequest = await context.req.json()
        request.userId = payload.id
        const response: BotResponse = await new BotService().createBot(request)
        return context.json(response)
    })
    .get("/token-api", jwtMiddleware, async (context: Context) => {
        const payload = context.get('jwtPayload')
        const response: BotTokenResponse = await new BotHandlerService().accessBotTokenGenerate(payload.id)
        return context.json(response)
    })
    .post("/message", botJwtMiddleware, async (context: Context) => {
        const payload = context.get('jwtPayload')
        const request: SendMessageRequest = await context.req.json()
        request.userId = payload.id
        await new BotHandlerService().sendMessage(request)
        return context.newResponse(null, 200)
    })
    .get("/:id?", jwtMiddleware, async (context: Context) => {
        const payload = context.get('jwtPayload')
        const { id } = context.req.query()

        if (id) return context.json(await new BotService().findBotById(id))

        const response: BotResponse[] = await new BotService().getAllBotsFromTheUser(payload.id)
        return context.json(response)
    })
    .delete("/:id?", jwtMiddleware, async (context: Context) => {
        const payload = context.get('jwtPayload')
        const { id } = context.req.query()
        await new BotService().deleteBot(payload.id, id)
        return context.newResponse(null, 200)
    })
    