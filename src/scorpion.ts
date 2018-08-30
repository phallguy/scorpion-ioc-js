import Binding from "./binding"
import BindingMap, { BindFunction } from "./bindingMap"
import Hunt from "./hunt"
import { Contract } from "./types"

export type PrepareFunction = BindFunction

export default class Scorpion {
  private readonly bindingMap: BindingMap

  constructor(private readonly parent?: Scorpion) {
    this.bindingMap = new BindingMap()
  }

  /**
   * Fetch an instance of an object that satisfies the requested contract.
   *
   * @param contract The class of the object to fetch.
   */
  public fetch(contract: Contract, ...args: any[]): any {
    const hunt = new Hunt(this, contract, args)
    return hunt.execute()
  }

  public prepare(fn: PrepareFunction): void {
    fn(this.bindingMap)
  }

  public findBinding(contract: Contract): Binding {
    let binding = this.bindingMap.find(contract)
    if (!binding && this.parent) {
      binding = this.parent.findBinding(contract)
    }

    return binding
  }

  public replicate() {
    const replica = new Scorpion(this)
    replica.bindingMap.replicateFrom(this.bindingMap)

    return replica
  }
}
