import { Class } from "../types"

export default function Inject(...args: any[]) {
  if (args.length < 3 || typeof args[2] === "undefined") {
    throw new Error("not implemented")
  } else if (args.length === 3 && typeof args[2] === "number") {
    return
  }

  throw new Error("Invalid @Inject Decorator declaration.")
}
