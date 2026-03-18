import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_PATH = path.join(process.cwd(), "app/data/content.json");

export async function GET() {
  try {
    const rawData = await fs.readFile(DATA_PATH, "utf-8");
    let data = JSON.parse(rawData);

    // Migration to UUIDs
    let migrated = false;
    const newRoles: Record<string, any> = {};

    if (data.roles) {
      for (const [key, role] of Object.entries(data.roles)) {
        const typedRole = role as any;
        if (!typedRole.name) {
          // This is an old role keyed by name
          const newId = crypto.randomUUID();
          newRoles[newId] = {
            ...typedRole,
            name: key,
          };
          migrated = true;
        } else {
          newRoles[key] = typedRole;
        }
      }
    }

    if (migrated) {
      data.roles = newRoles;
      // Save the migrated data immediately
      await fs.writeFile(
        DATA_PATH,
        JSON.stringify(data, null, 2),
        "utf-8"
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    await fs.writeFile(DATA_PATH, JSON.stringify(newData, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to write data" },
      { status: 500 },
    );
  }
}
