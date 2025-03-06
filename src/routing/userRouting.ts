import { UserService } from "../services/UserService.ts"
import { UserResponse } from "../data/models/interfaces/UserResponse.ts"
import { UserCreateRequest } from "../data/models/interfaces/UserCreateRequest.ts"
import { Context, Hono } from "hono";
import { LoginRequest } from "../data/models/interfaces/LoginRequest.ts";
import { loginResponse } from "../data/models/interfaces/LoginResponse.ts";

export const userRouting = new Hono()

userRouting
    .post('/', async (context: Context) => {
        const body: UserCreateRequest = await context.req.json()
        const response: UserResponse = await new UserService().saveUser(body)
        return context.json(response)
    })
    .post("/login", async (context: Context) => {
        const body: LoginRequest = await context.req.json()
        const response: loginResponse = await new UserService().login(body)
        return context.json(response)
    })