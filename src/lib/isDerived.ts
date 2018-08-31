import { Class } from "../types"

/**
 * Determines if `candidate` derives from `base` anywhere in its hierarchy.
 *
 * @param candidate The class of interest.
 * @param base The base class to look for.
 */
export default function isDerived(candidate: Class<any>, base: Class<any>): boolean {
  if (candidate === base) {
    return true
  }

  for (let p = candidate.prototype; !!p; p = p.prototype) {
    if (p instanceof base) {
      return true
    }
  }

  return false
}
