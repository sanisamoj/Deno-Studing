import { Hono } from 'hono'
import { Config } from "./Config.ts"
import { userRouting } from "./routing/userRouting.ts"
import { errorHandler } from "./errors/errorHandler.ts"
import { JwtVariables } from "hono/jwt";
import { botRouting } from "./routing/botRouting.ts";

Config.initializeSystem()

export type Variables = JwtVariables

const app = new Hono()
app.route("/users", userRouting)
app.route("/bots", botRouting)
app.onError(errorHandler)

Deno.serve({ port: Config.PORT }, app.fetch)
