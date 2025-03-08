import { JWTPayload, SignJWT } from "npm:jose@5.9.6"

export class TokenGenerator {
  public static async generateToken(payload: JWTPayload, secret: string): Promise<string> {
    const encodedSecret: Uint8Array<ArrayBufferLike> = new TextEncoder().encode(secret)

    if (!payload.exp) {
      // Se não tiver, adiciona a expiração padrão de 30 dias
      payload.exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
    }

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(encodedSecret)

    return jwt
  }

  public static async customGenerateToken(userId: string): Promise<string> {
    const encodedSecret: Uint8Array<ArrayBufferLike> = new TextEncoder().encode(Deno.env.get("USER_SECRET"))

    const payload: JWTPayload = {
      sub: userId,
      id: userId
    }

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(encodedSecret)

    return jwt
  }

  public static async botGenerateToken(userId: string): Promise<string> {
    const encodedSecret: Uint8Array<ArrayBufferLike> = new TextEncoder().encode(Deno.env.get("BOT_SECRET"))

    const payload: JWTPayload = {
      sub: userId,
      id: userId
    }

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("365d")
      .sign(encodedSecret)

    return jwt
  }

}