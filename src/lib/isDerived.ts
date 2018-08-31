import { Class } from "../types"

export default function isDerived(candidate: Class, base: Class): boolean {
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
