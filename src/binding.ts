import Hunt from "./hunt"
import isDerived from "./lib/isDerived"
import { Contract } from "./types"

/**
 * Associates a concrete class or factory for resolving contracts of the given
 * type `T`.
 *
 * @typeparam T A class that can be instantiated and injected.
 */
export default abstract class Binding<T> {
  /**
   * @param contract A class describing the minimum contract that must be met
   * to satisfy the binding.
   */
  constructor(public readonly contract: Contract<T>) {}

  /**
   * Determines if the binding satisfies the requested contract.
   *
   * @param conract The class being hunted down by the scorpion.
   */
  public isMatch(contract: Contract<T>): boolean {
    return isDerived(this.contract, contract)
  }

  /**
   * Fetch an instance of the [[contract]].
   */
  public fetch(hunt: Hunt): Promise<T> {
    throw new Error("Not implemented")
  }

  /**
   * Releases any resources held by the binding (such as a DB connection pool).
   * Called at the end of a [[Scorpion scorpion's]] lifetime.
   */
  public release(): void {}

  /**
   * Clone the binding for use by a new [[Scorpion]].
   */
  public replicate(): Binding<T> {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }
}
