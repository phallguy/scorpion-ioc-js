import Binding from "./binding"
import BindingMap, { BindFunction } from "./bindingMap"
import Hunt from "./hunt"
import { Contract } from "./types"

export type PrepareFunction = BindFunction

export default class Scorpion {
  private readonly bindingMap: BindingMap
  public readonly parent?: Scorpion

  constructor(parent?: Scorpion)
  constructor(prepare: PrepareFunction)
  constructor(parentOrFunction?: any) {
    this.bindingMap = new BindingMap()

    if (typeof parentOrFunction === "function") {
      this.prepare(parentOrFunction)
    } else {
      this.parent = parentOrFunction as Scorpion
    }
  }

  /**
   * Fetch an instance of an object that satisfies the requested contract.
   *
   * @param contract The class of the object to fetch.
   */
  public fetch(contract: Contract, ...args: any[]): any {
    Object.freeze(this.bindingMap)

    const hunt = new Hunt(this)
    return hunt.fetch(contract, ...args)
  }

  public prepare(fn: PrepareFunction): void {
    if (Object.isFrozen(this.bindingMap)) {
      throw new Error("Cannot prepare after objects have been fetched.")
    }

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
