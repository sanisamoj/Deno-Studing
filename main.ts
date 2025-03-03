import { Hono } from 'hono'
import { baseRouting } from "./routing/baseRouting.ts"
import { Config } from "./Config.ts"

Config.initializeDatabase()

const app = new Hono()
app.route("/", baseRouting)

Deno.serve({ port: Config.PORT }, app.fetch)
