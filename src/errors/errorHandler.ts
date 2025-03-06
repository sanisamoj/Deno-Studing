import { Context } from "hono"
import { Errors } from "../data/models/types/Errors.ts";

export const errorHandler = (error: Error, context: Context) => {
    
    switch (error.message) {
        case Errors.ItemNotFound:
            return context.json({ message: error.message }, 404)
        case Errors.NoItemsWereDeleted:
            return context.json({ message: error.message }, 400)
        case Errors.ItemAlreadyExists:
            return context.json({ message: error.message }, 409)
        case Errors.InvalidCredentials:
            return context.json({ message: error.message }, 401)
        default:
            return context.json({ message: Errors.UnknownError }, 500)
    }

}
