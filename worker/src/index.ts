import { Hono } from "hono"
import { cors } from "hono/cors"
import { drizzle } from "drizzle-orm/d1"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import * as schema from "./db/schema"
import {
    validateSession,
    invalidateSession,
    makeSessionCookie,
    getSessionIdFromRequest
} from "./auth/session"
import { handleGoogleLogin, handleGoogleCallback } from "./auth/google"

type Env = {
    DB: D1Database
    ASSETS: Fetcher
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_REDIRECT_URI: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors({
    origin: ["http://localhost:5173", "https://cmtidk.pages.dev"],
    credentials: true
}))

async function requireAuth(c: any) {
    const sessionId = getSessionIdFromRequest(c.req.raw)
    if (!sessionId) return null
    return await validateSession(c.env.DB, sessionId)
}

app.get("/api/auth/google", handleGoogleLogin)
app.get("/api/auth/google/callback", handleGoogleCallback)

app.get("/api/auth/me", async (c) => {
    const user = await requireAuth(c)
    if (!user) return c.json({ user: null }, 401)
    return c.json({ user })
})

app.post("/api/auth/logout", async (c) => {
    const sessionId = getSessionIdFromRequest(c.req.raw)
    if (sessionId) await invalidateSession(c.env.DB, sessionId)
    c.header("Set-Cookie", makeSessionCookie("", true))
    return c.json({ success: true })
})

app.get("/api/documents", async (c) => {
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)
    const db = drizzle(c.env.DB, { schema })
    const docs = await db.select({
        id: schema.documents.id,
        title: schema.documents.title,
        artist: schema.documents.artist,
        createdAt: schema.documents.createdAt,
        updatedAt: schema.documents.updatedAt
    })
        .from(schema.documents)
        .where(eq(schema.documents.ownerId, auth.id))
    return c.json(docs)
})

app.get("/api/documents/:id", async (c) => {
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)
    const db = drizzle(c.env.DB, { schema })
    const doc = await db.select()
        .from(schema.documents)
        .where(eq(schema.documents.id, c.req.param("id")))
        .get()
    if (!doc) return c.json({ error: "Not found" }, 404)
    if (doc.ownerId !== auth.id) return c.json({ error: "Forbidden" }, 403)
    return c.json({
        ...doc,
        docSettings: JSON.parse(doc.docSettings),
        sections: JSON.parse(doc.sections)
    })
})

app.post("/api/documents", async (c) => {
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)
    const body = await c.req.json()
    const db = drizzle(c.env.DB, { schema })
    const doc = {
        id: nanoid(),
        ownerId: auth.id,
        title: body.title ?? "Untitled",
        artist: body.artist ?? "",
        musicRoot: body.musicRoot ?? 0,
        docSettings: JSON.stringify(body.docSettings),
        sections: JSON.stringify(body.sections ?? [])
    }
    await db.insert(schema.documents).values(doc)
    return c.json({ id: doc.id })
})

app.put("/api/documents/:id", async (c) => {
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)
    const db = drizzle(c.env.DB, { schema })
    const doc = await db.select()
        .from(schema.documents)
        .where(eq(schema.documents.id, c.req.param("id")))
        .get()
    if (!doc) return c.json({ error: "Not found" }, 404)
    if (doc.ownerId !== auth.id) return c.json({ error: "Forbidden" }, 403)
    const body = await c.req.json()
    await db.update(schema.documents)
        .set({
            title: body.title,
            artist: body.artist,
            musicRoot: body.musicRoot,
            docSettings: JSON.stringify(body.docSettings),
            sections: JSON.stringify(body.sections)
        })
        .where(eq(schema.documents.id, c.req.param("id")))
    return c.json({ success: true })
})

app.delete("/api/documents/:id", async (c) => {
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)
    const db = drizzle(c.env.DB, { schema })
    const doc = await db.select()
        .from(schema.documents)
        .where(eq(schema.documents.id, c.req.param("id")))
        .get()
    if (!doc) return c.json({ error: "Not found" }, 404)
    if (doc.ownerId !== auth.id) return c.json({ error: "Forbidden" }, 403)
    await db.delete(schema.documents)
        .where(eq(schema.documents.id, c.req.param("id")))
    return c.json({ success: true })
})

export default app
