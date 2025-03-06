import { Context } from "hono"
import { Errors } from "../data/models/types/Errors.ts";
import { HTTPException } from "hono/http-exception";

export const errorHandler = (error: Error, context: Context) => {
    console.log(error.message)

    if (error instanceof HTTPException) {
        return error.getResponse()
    }

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
