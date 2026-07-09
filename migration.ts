import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env manually
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      value = value.trim().replace(/^['"](.*)['"]$/, '$1');
      process.env[key] = value;
    }
  });
}

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_PUBLISHABLE_KEY!);

type OldToolCategory = { category: string; items: string[] };
type NewToolItem = { name: string; show_on_home: boolean };
type NewToolCategory = { category: string; items: NewToolItem[] };
type ProfilCategory = { label: string; items: string[] };

async function run() {
  const { data: settings } = await supabase.from('site_settings').select('id, tools_json').single();
  const { data: profil } = await supabase.from('projects').select('id, tags_categorises').eq('project_type', 'profil').single();

  if (!settings) {
    console.error("No settings found");
    return;
  }

  const oldTools = (settings.tools_json || []) as OldToolCategory[];
  const profilTools = (profil?.tags_categorises || []) as ProfilCategory[];

  const mergedTools: NewToolCategory[] = [];
  const categoriesMap = new Map<string, Map<string, NewToolItem>>();

  // First, process oldTools (from home page)
  for (const cat of oldTools) {
    if (!categoriesMap.has(cat.category)) {
      categoriesMap.set(cat.category, new Map());
    }
    const itemsMap = categoriesMap.get(cat.category)!;
    for (const item of cat.items) {
      if (typeof item === 'string') {
        itemsMap.set(item.toLowerCase(), { name: item, show_on_home: true });
      } else {
        // Handle case where it's already an object somehow
        const obj = item as any;
        itemsMap.set((obj.name || '').toLowerCase(), { name: obj.name || '', show_on_home: obj.show_on_home ?? true });
      }
    }
  }

  // Next, process profilTools
  for (const cat of profilTools) {
    let targetCatName = cat.label;
    let targetItemsMap: Map<string, NewToolItem> | null = null;

    for (const [existingCatName, map] of categoriesMap.entries()) {
      if (existingCatName.toLowerCase() === cat.label.toLowerCase()) {
        targetCatName = existingCatName;
        targetItemsMap = map;
        break;
      }
    }

    if (!targetItemsMap) {
      targetItemsMap = new Map();
      categoriesMap.set(targetCatName, targetItemsMap);
    }

    for (const item of cat.items) {
      let matchedKey = null;
      let existingItem = null;
      const itemNameLower = typeof item === 'string' ? item.toLowerCase() : (item as any).name?.toLowerCase();
      if (!itemNameLower) continue;

      for (const [key, val] of targetItemsMap.entries()) {
        if (itemNameLower.includes(key) || key.includes(itemNameLower)) {
          matchedKey = key;
          existingItem = val;
          break;
        }
      }

      const itemNameStr = typeof item === 'string' ? item : (item as any).name;

      if (existingItem) {
        targetItemsMap.delete(matchedKey!);
        const bestName = itemNameStr.length > existingItem.name.length ? itemNameStr : existingItem.name;
        targetItemsMap.set(bestName.toLowerCase(), { name: bestName, show_on_home: existingItem.show_on_home });
      } else {
        targetItemsMap.set(itemNameLower, { name: itemNameStr, show_on_home: false });
      }
    }
  }

  for (const [catName, itemsMap] of categoriesMap.entries()) {
    mergedTools.push({
      category: catName,
      items: Array.from(itemsMap.values())
    });
  }

  console.log("Merged tools:", JSON.stringify(mergedTools, null, 2));

  const { error: settingsError } = await supabase
    .from('site_settings')
    .update({ tools_json: mergedTools as any })
    .eq('id', settings.id);

  if (settingsError) {
    console.error("Error updating settings:", settingsError);
    return;
  }

  if (profil) {
    const { error: profilError } = await supabase
      .from('projects')
      .update({ tags_categorises: null })
      .eq('id', profil.id);
    if (profilError) {
      console.error("Error updating profil:", profilError);
    } else {
      console.log("Successfully cleared tags_categorises from profil");
    }
  }

  console.log("Migration completed successfully.");
}

run();
