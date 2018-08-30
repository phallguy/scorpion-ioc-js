import Binding, { Factory } from "../binding"
import Hunt from "../hunt"
import { Contract } from "../types"

export default class FactoryBinding extends Binding {
  constructor(contract: Contract, private readonly factory: Factory) {
    super(contract)
  }

  public fetch(hunt: Hunt): any {
    return this.factory(hunt.scorpion)
  }
}
