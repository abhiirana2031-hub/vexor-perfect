/** MongoDB documents: app uses string `_id` values (not ObjectId). */
export type CmsDoc = {
  _id: string;
  [key: string]: unknown;
};
