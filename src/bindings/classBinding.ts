import Binding from "../binding"
import Hunt from "../hunt"

import "reflect-metadata"

export default class ClassBinding extends Binding {
  public fetch(hunt: Hunt): any {
    const resolvedArgs = hunt.resolveArguments(this.contract)
    return new this.contract(...resolvedArgs)
  }
}
