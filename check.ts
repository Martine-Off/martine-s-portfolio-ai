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

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_PUBLISHABLE_KEY!);

async function run() {
  const { data: roles, error } = await supabase.from("user_roles").select("*");
  console.log("Roles:", roles);
  console.log("Error:", error);
}
run();
