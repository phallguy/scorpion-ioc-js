import { Class } from "../types"

import "reflect-metadata"
export const INJECTABLE_ANNOTATION_KEY = "__injectable__"

export default function Injectable<T extends Class>(constructor: T): T {
  return constructor
}
