import { Context, Hono } from 'hono'
import { MongodbOperations } from "./mongodb/MongodbOperations.ts"
import { Collections } from "./mongodb/Collections.ts"

const app = new Hono()

app.get('/', async (context: Context) => {
  const mongodbOperations: MongodbOperations = await MongodbOperations.getInstance()
  const response = await mongodbOperations.findAll(Collections.WORK_ORDERS, {"petShopId": "67c25136def8365f692127bc"})
  return context.json(response)
})

const PORT: number = parseInt(Deno.env.get("PORT") || "8000")
Deno.serve({ port: PORT }, app.fetch)
