import Binding from "../binding"
import Hunt from "../hunt"
import { Contract, Factory } from "../types"

/**
 * Implements a [[Binding]] that delegates materialization to a [[Factory]]
 * function.
 */
export default class FactoryBinding<T> extends Binding<T> {
  constructor(contract: Contract<T>, private readonly factory: Factory<T>) {
    super(contract)
  }

  public fetch(hunt: Hunt): Promise<T> {
    return this.factory(hunt, ...hunt.args)
  }
}
