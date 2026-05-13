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

app.get("/api/users/shares", async (c) => {
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)
    console.log(auth.id)

    const db = drizzle(c.env.DB, { schema })
    const docs = await db.select({
        id: schema.documents.id,
        title: schema.documents.title,
        artist: schema.documents.artist,
        createdAt: schema.documents.createdAt,
        updatedAt: schema.documents.updatedAt
    })
        .from(schema.documentShares)
        .innerJoin(schema.documents, eq(schema.documentShares.documentId, schema.documents.id))
        .where(eq(schema.documentShares.userId, auth.id))
    return c.json(docs)
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

app.post("/api/documents", async (c) => {
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)

    const body = await c.req.json()
    const db = drizzle(c.env.DB, { schema })
    const doc = {
        id: nanoid(),
        ownerId: auth.id,
        title: body.title ?? "New Document",
        artist: body.artist ?? "Me",
        musicRoot: body.musicRoot ?? 0,
        docSettings: JSON.stringify(body.docSettings),
        sections: JSON.stringify(body.sections ?? [])
    }
    await db.insert(schema.documents).values(doc)
    return c.json({ id: doc.id })
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

    if (doc.ownerId !== auth.id) {
        const share = await db.select()
            .from(schema.documentShares)
            .where(eq(schema.documentShares.userId, auth.id))
            .get()

        if (!share?.role) return c.json({ error: "Forbidden" }, 403)
    }

    return c.json({
        ...doc,
        docSettings: JSON.parse(doc.docSettings),
        sections: JSON.parse(doc.sections)
    })
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

    if (doc.ownerId !== auth.id) {
        const share = await db.select()
            .from(schema.documentShares)
            .where(eq(schema.documentShares.userId, auth.id))
            .get()

        if (share?.role !== "editor") return c.json({ error: "Forbidden" }, 403)
    }

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

app.get("/api/documents/:id/shares", async (c) => {
    const db = drizzle(c.env.DB, { schema })
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)

    const doc = await db.select()
        .from(schema.documents)
        .where(eq(schema.documents.id, c.req.param("id")))
        .get()
    if (!doc) return c.json({ error: "Not found" }, 404)
    if (doc.ownerId !== auth.id) return c.json({ error: "Forbidden" }, 403)

    const shares = await db.select()
        .from(schema.documentShares)
        .where(eq(schema.documentShares.documentId, c.req.param("id")))
    return c.json(shares)
})

app.post("/api/documents/:id/shares", async (c) => {
    const db = drizzle(c.env.DB, { schema })
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)

    const doc = await db.select()
        .from(schema.documents)
        .where(eq(schema.documents.id, c.req.param("id")))
        .get()
    if (!doc) return c.json({ error: "Document not found" }, 404)
    if (doc.ownerId !== auth.id) return c.json({ error: "Forbidden" }, 403)

    const { email, role } = await c.req.json()
    const invitedUser = await db.select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .get()
    if (!invitedUser) return c.json({ error: "User not found" }, 404)

    const share = {
        id: nanoid(),
        name: email,
        documentId: doc.id,
        userId: invitedUser.id,
        role: role,
    }

    await db.insert(schema.documentShares)
        .values(share)
    return c.json({ success: true })
})

app.patch("/api/documents/:docid/shares/:shareid", async (c) => {
    const db = drizzle(c.env.DB, { schema })
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)

    const doc = await db.select()
        .from(schema.documents)
        .where(eq(schema.documents.id, c.req.param("docid")))
        .get()
    if (!doc) return c.json({ error: "Document not found" }, 404)
    if (doc.ownerId !== auth.id) return c.json({ error: "Forbidden" }, 403)

    const body = await c.req.json()
    await db.update(schema.documentShares)
        .set({
            role: body.role
        })
        .where(eq(schema.documentShares.id, c.req.param("shareid")))
    return c.json({ success: true })
})

app.delete("/api/documents/:docid/shares/:shareid", async (c) => {
    const db = drizzle(c.env.DB, { schema })
    const auth = await requireAuth(c)
    if (!auth) return c.json({ error: "Unauthorized" }, 401)

    const doc = await db.select()
        .from(schema.documents)
        .where(eq(schema.documents.id, c.req.param("docid")))
        .get()
    if (!doc) return c.json({ error: "Document not found" }, 404)
    if (doc.ownerId !== auth.id) return c.json({ error: "Forbidden" }, 403)

    const share = await db.select()
        .from(schema.documentShares)
        .where(eq(schema.documentShares.id, c.req.param("shareid")))
        .get()
    if (!share) return c.json({ error: "Share not found" }, 404)

    await db.delete(schema.documentShares)
        .where(eq(schema.documentShares.id, c.req.param("shareid")))
    return c.json({ success: true })
})

export default app
