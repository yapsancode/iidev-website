import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getPlatformProxy } from "wrangler";

const migrationsDir = fileURLToPath(new URL("../../migrations/", import.meta.url));

/** A real, empty D1 database in memory with every migration applied. Call `dispose` when done. */
export async function createTestDb(): Promise<{ db: D1Database; dispose: () => Promise<void> }> {
  // The retention config is the smallest one that has the DB binding. `persist: false` keeps it in memory.
  const proxy = await getPlatformProxy<{ DB: D1Database }>({
    configPath: fileURLToPath(new URL("../../wrangler.retention.jsonc", import.meta.url)),
    persist: false,
  });
  const db = proxy.env.DB;
  for (const file of readdirSync(migrationsDir).sort()) {
    const sql = readFileSync(`${migrationsDir}${file}`, "utf8").replace(/--.*$/gm, "");
    for (const statement of sql.split(";").map((part) => part.trim()).filter(Boolean)) {
      await db.prepare(statement).run();
    }
  }
  return { db, dispose: () => proxy.dispose() };
}

export async function addFounder(db: D1Database, id: string, email: string, fullName: string, active = 1): Promise<void> {
  await db
    .prepare("INSERT INTO internal_users(id,email,full_name,role,active) VALUES(?,?,?,'founder',?)")
    .bind(id, email, fullName, active)
    .run();
}
