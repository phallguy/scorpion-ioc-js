import Scorpion from "./scorpion"
import Dependency, { Factory } from "./dependency"
import { Contract } from "./types"

export default class DependencyMap {
  private bindings: any[]
  private activeBindings: any[]
  private sharedBindings: any[]

  constructor(private scorpion: Scorpion) {
    this.bindings = this.activeBindings = []
    this.sharedBindings = []
  }

  find(contract: Contract): Dependency {
    throw new Error("Nope")
  }

  bind(contract: Contract, options = {}, factory?: Factory) {
    this.activeBindings.push(new Dependency(contract, options, factory))
  }

  private reset() {
    // todo release

    this.bindings = this.activeBindings = []
    this.sharedBindings = []
  }
}
