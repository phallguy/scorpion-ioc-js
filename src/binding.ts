import Hunt from "./hunt"
import isDerived from "./lib/isDerived"
import { Contract } from "./types"

export type Factory<T> = (hunt: Hunt) => T

export default abstract class Binding<T> {
  constructor(public readonly contract: Contract<T>) {}

  public isMatch(contract: Contract<T>): boolean {
    return isDerived(this.contract, contract)
  }

  public fetch(hunt: Hunt): any {
    throw new Error("Not implemented")
  }

  public release(): void {}
  public replicate(): Binding<T> {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }
}
