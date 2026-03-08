import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const itemsPath = path.join(process.cwd(), "app/data/items.json");
    if (!fs.existsSync(itemsPath)) {
      console.error("Items index not found at:", itemsPath);
      return NextResponse.json(
        { error: "Search index not ready" },
        { status: 500 },
      );
    }
    const items = JSON.parse(fs.readFileSync(itemsPath, "utf8"));

    const normalize = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const normalizedQuery = normalize(query);

    // Detect tier pattern like "t2", "t4.1", "t8.4"
    const tierMatch = normalizedQuery.match(/\bt(\d)(\.\d)?\b/);
    const targetTierPrefix = tierMatch ? `T${tierMatch[1]}` : null;
    const targetEnchantment = tierMatch?.[2] ? tierMatch[2] : ""; // e.g., ".1"

    // Remove tier from query for text matching
    const searchTerms = normalizedQuery
      .replace(/\bt\d(\.\d)?\b/g, "")
      .split(/\s+/)
      .filter((term) => term.length > 0);

    const isCosmetic = (id: string) =>
      id.includes("UNIQUE_UNLOCK_") ||
      id.includes("_VANITY_") ||
      id.includes("_SKIN_") ||
      id.includes("_DYE_");

    const filtered = items
      .filter((item: any) => {
        // Exclude cosmetics
        if (isCosmetic(item.id)) return false;

        const itemId = item.id;
        const itemNameEn = normalize(item.name_en);
        const itemNameEs = normalize(item.name_es);

        // If tier is specified, item ID must start with it (e.g., T4 if t4)
        if (targetTierPrefix && !itemId.startsWith(targetTierPrefix)) {
          return false;
        }

        // If enchantment is specified (e.g., .1), item ID must contain @1
        if (targetEnchantment) {
          const enchantLevel = targetEnchantment.substring(1); // "1"
          if (!itemId.includes(`@${enchantLevel}`)) return false;
        }

        // All non-tier search terms must be present in either name or ID
        return searchTerms.every(
          (term) =>
            itemNameEn.includes(term) ||
            itemNameEs.includes(term) ||
            itemId.toLowerCase().includes(term),
        );
      })
      .slice(0, 48); // Increased limit for better variety with fuzzy results

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error searching items:", error);
    return NextResponse.json(
      { error: "Failed to search items" },
      { status: 500 },
    );
  }
}
