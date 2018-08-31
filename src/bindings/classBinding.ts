import Binding from "../binding"
import Hunt from "../hunt"

import "reflect-metadata"

/**
 * Implements a [[Binding]] that creates a new instance of he desired type `T`
 * when a scorpion hunts for a contract.
 */
export default class ClassBinding<T> extends Binding<T> {
  public fetch(hunt: Hunt): any {
    const resolvedArgs = hunt.resolveArguments(this.contract)
    const instance = new this.contract(...resolvedArgs)

    return instance
  }
}
