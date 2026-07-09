import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");
  envFile.split("\n").forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      let val = match[2].trim();
      if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("\'") && val.endsWith("\'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[match[1].trim()] = val;
    }
  });
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY doivent être définies");
}

const supabase = createClient(url, key);

async function run() {
  const { data: settings } = await supabase.from("site_settings").select("*").single();
  let toolsJson = settings.tools_json;

  let newToolsJson = [];
  for (let cat of toolsJson) {
    let newItems = [];
    for (let item of cat.items) {
      if (typeof item === "string") {
        newItems.push({ name: item, show_on_home: true }); // By default, let's say true to keep home displaying them
      } else if (typeof item === "object" && item.name) {
        newItems.push(item);
      }
    }
    newToolsJson.push({ category: cat.category, items: newItems });
  }

  // Now add missing items and fix TOSA scores
  for (let cat of newToolsJson) {
    if (cat.category === "IA et assistants") {
      if (!cat.items.find((i: any) => i.name === "ChatGPT")) {
        cat.items.push({ name: "ChatGPT", show_on_home: false });
      }
    }
    if (cat.category === "No-code / Automatisation") {
      if (!cat.items.find((i: any) => i.name === "Notion")) {
        cat.items.push({ name: "Notion", show_on_home: false });
      }
    }
    if (cat.category === "Design et prototypage") {
      const idx = cat.items.findIndex((i: any) => i.name.includes("InDesign"));
      if (idx !== -1) {
        cat.items[idx].name = "Suite Adobe (InDesign - TOSA Avancé 855/1000)";
      }
    }
    if (cat.category === "Suites bureautiques") {
      const idx = cat.items.findIndex((i: any) => i.name.includes("Excel - TOSA"));
      if (idx !== -1) {
        cat.items[idx].name = "Excel - TOSA Expert 912/1000";
      }
    }
  }

  const { error } = await supabase.from("site_settings").update({ tools_json: newToolsJson }).eq("id", settings.id);
  if (error) {
    console.error("Failed to update tools_json:", error);
  } else {
    console.log("Updated tools_json successfully. New structure:");
    console.log(JSON.stringify(newToolsJson, null, 2));
  }

  // Delete old block
  const { data: profilProj } = await supabase.from("projects").select("id").eq("project_type", "profil").single();
  if (profilProj) {
    const { error: errDel } = await supabase.from("project_blocks").delete().eq("project_id", profilProj.id).ilike("title", "%Outils%");
    if (errDel) {
      console.error("Failed to delete block", errDel);
    } else {
      console.log("Deleted old Outils block from project_blocks");
    }
  }
}

run();
