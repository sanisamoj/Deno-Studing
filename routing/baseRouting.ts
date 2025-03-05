import { Context, Hono } from 'hono'
import { Collections } from "../mongodb/Collections.ts"
import { MongodbOperations } from "../mongodb/MongodbOperations.ts"

export const baseRouting = new Hono()

baseRouting
    .get('/', async (context: Context) => {
        const mongodbOperations: MongodbOperations = await MongodbOperations.getInstance()
        mongodbOperations.countDocuments(Collections.PRODUCTS, { "petShopId": "67c25136def8365f692127bc" })
        const response = await mongodbOperations.findAll(Collections.PRODUCTS, { "petShopId": "67c25136def8365f692127bc" })
        return context.json(response)
    })