import type { Document } from "mongodb";

/** Shape returned to the browser (JSON-safe). */
export function serializeDocument(doc: Document): Record<string, unknown> {
  const out: Record<string, unknown> = { ...doc };
  const id = out._id;
  if (id !== undefined && id !== null) {
    out._id =
      typeof id === "object" && id !== null && "toString" in id
        ? String(id)
        : id;
  }
  for (const [key, value] of Object.entries(out)) {
    if (value instanceof Date) {
      out[key] = value.toISOString();
    }
  }
  return out;
}
