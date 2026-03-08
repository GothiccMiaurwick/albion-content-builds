/**
 * Generates the Albion Online Render API URL for a given item ID.
 * Handles automatic @0 suffix for items that typically require it.
 */
export function getAlbionImageUrl(
  itemId: string,
  size: number = 128,
  quality: number = 1, // Default to Normal quality (1) for fastest fetching. Albion uses 1-5.
): string {
  if (!itemId) return "";

  // La API de Render de Albion a menudo requiere @0 para mostrar la versión base de objetos encantables.
  let processedId = itemId;

  // Detectar si es un objeto que suele requerir sufijo (Equipo estándar, Comidas, Pociones)
  const needsSuffix = /(_SET\d|_CAPE|_MAIN_|_2H_|_OFF_|_MEAL_|_POTION_)/.test(
    itemId,
  );
  const isArtifact = /(_UNDEAD|_KEEPER|_HELL|_MORGANA|_DEMON|_AVALON)/.test(
    itemId,
  );

  if (needsSuffix && !isArtifact && !itemId.includes("@")) {
    processedId = `${itemId}@0`;
  }

  const url = new URL(
    `https://render.albiononline.com/v1/item/${processedId}.png`,
  );
  url.searchParams.set("size", size.toString());
  // Always set quality to optimize
  url.searchParams.set("quality", quality.toString());

  return url.toString();
}

/**
 * Parses an Albion Item ID and returns a formatted tier string (e.g., "T4", "T4.1").
 */
export function parseAlbionTier(itemId: string): string | null {
  if (!itemId || !itemId.startsWith("T") || isNaN(parseInt(itemId[1]))) {
    return null;
  }

  const tier = itemId[1];
  const enchantmentMatch = itemId.match(/@(\d+)/);
  const enchantment = enchantmentMatch ? enchantmentMatch[1] : null;

  if (enchantment && enchantment !== "0") {
    return `T${tier}.${enchantment}`;
  }

  return `T${tier}`;
}
