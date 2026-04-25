import { Google, decodeIdToken } from "arctic"
import { drizzle } from "drizzle-orm/d1"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import * as schema from "../db/schema"
import {
    createSession,
    makeSessionCookie,
    getSessionIdFromRequest,
    invalidateSession
} from "./session"

type Env = {
    DB: D1Database
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_REDIRECT_URI: string
}

function initGoogle(env: Env) {
    return new Google(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        env.GOOGLE_REDIRECT_URI
    )
}

export async function handleGoogleLogin(c: any) {
    const google = initGoogle(c.env)
    const state = nanoid()
    const codeVerifier = nanoid(96)
    const url = google.createAuthorizationURL(state, codeVerifier, [
        "openid", "email", "profile"
    ])

    c.header("Set-Cookie", `google_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`)
    c.header("Set-Cookie", `google_code_verifier=${codeVerifier}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`, { append: true })

    return c.redirect(url.toString())
}

export async function handleGoogleCallback(c: any) {
    const { code, state } = c.req.query()

    // Parse cookies
    const cookieHeader = c.req.header("Cookie") ?? ""
    const cookies = Object.fromEntries(
        cookieHeader.split(";")
            .map((s: string) => s.trim().split("="))
            .filter((p: string[]) => p.length === 2)
            .map(([k, v]: string[]) => [k, decodeURIComponent(v)])
    )

    if (!state || state !== cookies.google_state) {
        return c.json({ error: "Invalid state" }, 400)
    }

    const codeVerifier = cookies.google_code_verifier
    if (!codeVerifier) return c.json({ error: "Missing code verifier" }, 400)

    try {
        const google = initGoogle(c.env)
        const tokens = await google.validateAuthorizationCode(code, codeVerifier)

        const claims = decodeIdToken(tokens.idToken()) as {
            sub: string
            email: string
            name: string
            picture: string
        }

        const db = drizzle(c.env.DB, { schema })

        let user = await db.select()
            .from(schema.users)
            .where(eq(schema.users.googleId, claims.sub))
            .get()

        if (!user) {
            const newUser = {
                id: nanoid(),
                googleId: claims.sub,
                email: claims.email,
                name: claims.name,
                avatar: claims.picture ?? null,
            }
            await db.insert(schema.users).values(newUser)
            user = newUser
        }

        const sessionId = await createSession(c.env.DB, user.id)

        c.header("Set-Cookie", `google_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`)
        c.header("Set-Cookie", `google_code_verifier=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`, { append: true })
        c.header("Set-Cookie", makeSessionCookie(sessionId), { append: true })

        return c.redirect("/")
    } catch (e) {
        console.error(e)
        return c.json({ error: "OAuth failed" }, 500)
    }
}
