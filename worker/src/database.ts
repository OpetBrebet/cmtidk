import { drizzle } from "drizzle-orm/d1";
import * as schema from './db/schema'

export function createDb(DB: D1Database) {
    return drizzle(DB, { schema })
}
