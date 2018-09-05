import Binding from "../binding"
import Hunt from "../hunt"

import "reflect-metadata"

/**
 * Implements a [[Binding]] that creates a new instance of he desired type `T`
 * when a scorpion hunts for a contract.
 */
export default class ClassBinding<T> extends Binding<T> {
  public async fetch(hunt: Hunt): Promise<T> {
    const argPromises = hunt.resolveArguments(this.contract)

    return Promise.all(argPromises).then(resolvedArgs => new this.contract(...resolvedArgs))
  }
}
