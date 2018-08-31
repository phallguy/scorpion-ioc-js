import Binding from "../binding"
import Hunt from "../hunt"

import "reflect-metadata"

export default class ClassBinding<T> extends Binding<T> {
  public fetch(hunt: Hunt): any {
    const resolvedArgs = hunt.resolveArguments(this.contract)
    const instance = new this.contract(...resolvedArgs)

    return instance
  }
}
