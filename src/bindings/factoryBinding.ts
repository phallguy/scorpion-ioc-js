import Binding, { Factory } from "../binding"
import Hunt from "../hunt"
import { Contract } from "../types"

export default class FactoryBinding<T> extends Binding<T> {
  constructor(contract: Contract<T>, private readonly factory: Factory<T>) {
    super(contract)
  }

  public fetch(hunt: Hunt): T {
    return this.factory(hunt)
  }
}
