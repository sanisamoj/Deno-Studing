import { JWTPayload, jwtVerify, SignJWT } from "npm:jose@5.9.6";
import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const SECRET_KEY = Deno.env.get("USER_SECRET") as string

export const authMiddleware = async (context: Context, next: Next) => {
    const encodedSecret: Uint8Array<ArrayBufferLike> = new TextEncoder().encode(SECRET_KEY)

    try {
        const authHeader = context.request.headers.get("Authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            context.response.status = 401
            context.response.body = { error: "Token não fornecido" }
            return;
        }

        const token = authHeader.split(" ")[1]
        const { payload } = await jwtVerify(token, encodedSecret)

        context.state.user = payload;

        await next(); // Passa para a próxima função
    } catch (error) {
        context.response.status = 401;
        context.response.body = { error: "Token inválido ou expirado" };
    }
};
