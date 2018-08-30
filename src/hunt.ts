import ClassBinding from "./bindings/classBinding"
import Scorpion from "./scorpion"
import { Contract } from "./types"

export default class Hunt {
  constructor(
    public readonly scorpion: Scorpion,
    public readonly contract: Contract,
    public readonly args: any[]
  ) {}

  public execute(explicitOnly: boolean = false): any {
    let binding = this.scorpion.findBinding(this.contract)

    if (!binding && !explicitOnly) {
      binding = new ClassBinding(this.contract)
    }

    if (!binding) {
      throw new Error("Cannot resolve dependency")
    }

    return binding.fetch(this)
  }
}
