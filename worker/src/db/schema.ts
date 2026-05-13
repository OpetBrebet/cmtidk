import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const documents = sqliteTable("documents", {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    visibility: text("visibility", { enum: ["private", "viewing", "editing"] })
        .notNull()
        .default("private"),

    title: text("title").notNull(),
    artist: text("artist").notNull().default(""),
    musicRoot: integer("music_root").notNull().default(0),
    docSettings: text("doc_settings").notNull(),
    sections: text("sections").notNull(),
})

export const documentShares = sqliteTable("document_shares", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    documentId: text("document_id")
        .notNull()
        .references(() => documents.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["viewer", "editor"] })
        .notNull()
        .default("viewer"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
})

export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    googleId: text("google_id").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    avatar: text("avatar")
})

export const sessions = sqliteTable("sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull()
})
