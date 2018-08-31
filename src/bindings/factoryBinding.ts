import Binding, { Factory } from "../binding"
import Hunt from "../hunt"
import { Contract } from "../types"

/**
 * Implements a [[Binding]] that delegates materialization to a [[Factory]]
 * function.
 */
export default class FactoryBinding<T> extends Binding<T> {
  constructor(contract: Contract<T>, private readonly factory: Factory<T>) {
    super(contract)
  }

  public fetch(hunt: Hunt): T {
    return this.factory(hunt)
  }
}
