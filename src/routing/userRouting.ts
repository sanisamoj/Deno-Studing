import { UserResponse } from "../data/models/interfaces/UserResponse.ts"
import { UserCreateRequest } from "../data/models/interfaces/UserCreateRequest.ts"
import { Context, Hono } from "hono";
import { LoginRequest } from "../data/models/interfaces/LoginRequest.ts";
import { loginResponse } from "../data/models/interfaces/LoginResponse.ts";
import { jwt } from 'hono/jwt'
import { UserService } from "../services/user/UserService.ts";
import { Variables } from "../main.ts"; 
import { Config } from "../Config.ts";

export const userRouting = new Hono<{ Variables: Variables }>()
const jwtMiddleware = jwt({
    secret: Config.USER_SECRET_KEY,
})

userRouting
    .post('/', async (context: Context) => {
        const request: UserCreateRequest = await context.req.json()
        const response: UserResponse = await new UserService().saveUser(request)
        return context.json(response)
    })
    .post("/login", async (context: Context) => {
        const request: LoginRequest = await context.req.json()
        const response: loginResponse | undefined = await new UserService().login(request)
        if (response) {
            return context.json(response)
        } else {
            return context.newResponse(null, 200)
        }
    })
    .get("/session", jwtMiddleware, async (context: Context) => {
        const payload = context.get('jwtPayload')
        const response: UserResponse = await new UserService().session(payload.id)
        return context.json(response)
    })
    