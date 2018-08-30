import Hunt from "./hunt"
import isDerived from "./lib/isDerived"
import Scorpion from "./scorpion"
import { Contract } from "./types"

export type Factory = (scorpion: Scorpion) => any

export default abstract class Binding {
  constructor(
    public readonly contract: Contract
  ) {}

  public isMatch(contract: Contract): boolean {
    return isDerived(this.contract, contract)
  }

  public fetch(hunt: Hunt): any {
    throw new Error("Not implemented")
  }

  public release(): void {}
  public replicate(): Binding {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }
}
