import Scorpion from "./scorpion"
import { Contract } from "./types"
import isDerived from "./lib/isDerived"

export type Factory = (scorpion: Scorpion) => any

export default class Dependency {
  constructor(
    private readonly contract: Contract,
    private readonly options?: object,
    private readonly factory?: Factory
  ) {
    if (typeof contract === "string" && !factory) {
      throw new Error("String contracts must have a factory method")
    }
  }

  satisfies(contract: Contract): boolean {
    if (typeof this.contract === "string") {
      if (typeof contract === "string") {
        return this.contract === contract
      }
    } else {
      if (typeof contract !== "string") {
        return isDerived(this.contract, contract)
      }
    }

    return false
  }

  release(): void {}
}
