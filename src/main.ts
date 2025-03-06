import { Hono } from 'hono'
import { Config } from "./Config.ts"
import { userRouting } from "./routing/userRouting.ts"
import { errorHandler } from "./errors/errorHandler.ts"

await Config.initializeDatabase()

const app = new Hono()
app.route("/users", userRouting)
app.onError(errorHandler)

Deno.serve({ port: Config.PORT }, app.fetch)
