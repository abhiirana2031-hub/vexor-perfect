/** CMS collection names persisted in MongoDB */
export const CMS_COLLECTIONS = new Set([
  "projects",
  "services",
  "teammembers",
  "testimonials",
]);

export function assertAllowedCollection(collection: string): void {
  if (!CMS_COLLECTIONS.has(collection)) {
    throw new Error(`Unknown collection: ${collection}`);
  }
}
