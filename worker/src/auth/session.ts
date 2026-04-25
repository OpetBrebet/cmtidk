import { drizzle } from "drizzle-orm/d1"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import * as schema from "../db/schema"

const SESSION_COOKIE = "session"
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

export function sessionCookieName() {
    return SESSION_COOKIE
}

export async function createSession(DB: D1Database, userId: string): Promise<string> {
    const db = drizzle(DB, { schema })
    const sessionId = nanoid(40)
    await db.insert(schema.sessions).values({
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS)
    })

    return sessionId
}

export async function validateSession(DB: D1Database, sessionId: string) {
    const db = drizzle(DB, { schema })
    const result = await db.select({
        session: schema.sessions,
        user: schema.users
    })
        .from(schema.sessions)
        .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
        .where(eq(schema.sessions.id, sessionId))
        .get()

    if (!result) return null
    if (result.session.expiresAt < new Date()) {
        await db.delete(schema.sessions)
            .where(eq(schema.sessions.id, sessionId))
        return null
    }

    return result.user
}

export async function invalidateSession(DB: D1Database, sessionId: string) {
    const db = drizzle(DB, { schema })
    await db.delete(schema.sessions)
        .where(eq(schema.sessions.id, sessionId))
}

export function makeSessionCookie(sessionId: string, clear = false): string {
    if (clear) {
        return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
    }

    const maxAge = SESSION_DURATION_MS / 1000
    return `${SESSION_COOKIE}=${sessionId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
}

export function getSessionIdFromRequest(req: Request): string | null {
    const cookieHeader = req.headers.get("Cookie") ?? ""
    const cookies = Object.fromEntries(
        cookieHeader.split(";")
            .map(s => s.trim().split("="))
            .filter(p => p.length === 2)
            .map(([k, v]) => [k, decodeURIComponent(v)])
    )

    return cookies[SESSION_COOKIE] ?? null
}
