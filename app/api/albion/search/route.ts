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

    const filtered = items
      .filter(
        (item: any) =>
          normalize(item.name_en).includes(normalizedQuery) ||
          normalize(item.name_es).includes(normalizedQuery) ||
          item.id.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 50); // Limit results for performance

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error searching items:", error);
    return NextResponse.json(
      { error: "Failed to search items" },
      { status: 500 },
    );
  }
}
