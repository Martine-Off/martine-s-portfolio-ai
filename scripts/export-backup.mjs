// scripts/export-backup.mjs
// Exports all 4 Supabase tables to local JSON files in backups/<date>/
// Run with: node scripts/export-backup.mjs

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env manually (no dotenv dependency required)
import { readFileSync } from "fs";
const envPath = join(__dirname, "..", ".env");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const [key, ...rest] = l.split("=");
      return [key.trim(), rest.join("=").trim().replace(/^"|"$/g, "")];
    })
);

const SUPABASE_URL = env["VITE_SUPABASE_URL"];
const SUPABASE_KEY = env["VITE_SUPABASE_PUBLISHABLE_KEY"];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌  VITE_SUPABASE_URL ou VITE_SUPABASE_PUBLISHABLE_KEY manquant dans .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TABLES = ["projects", "project_blocks", "site_settings", "user_roles"];

// Dossier backups/<YYYY-MM-DD>/
const today = new Date().toISOString().slice(0, 10);
const backupDir = join(__dirname, "..", "backups", today);
mkdirSync(backupDir, { recursive: true });

console.log(`📁  Dossier de backup : ${backupDir}\n`);

for (const table of TABLES) {
  const { data, error } = await supabase.from(table).select("*");

  if (error) {
    console.error(`❌  Erreur sur la table "${table}":`, error.message);
    process.exit(1);
  }

  const filePath = join(backupDir, `${table}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅  ${table}.json — ${data.length} ligne(s)`);
}

console.log("\n🎉  Export terminé !");
