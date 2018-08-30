import Binding, { Factory } from "./binding"
import CapturedBinding from "./bindings/capturedBinding"
import createBinding from "./createBinding"
import { Contract } from "./types"

export type BindFunction = (map: BindingMap) => void

export default class BindingMap {
  private bindings: any[]
  private sharedBindings: any[]

  constructor() {
    this.bindings = []
    this.sharedBindings = []
  }

  public find(contract: Contract): Binding {
    return (
      this.bindings.find(b => b.isMatch(contract)) ||
      this.sharedBindings.find(b => b.isMatch(contract)) ||
      null
    )
  }

  public bind(contract: Contract, factory?: Factory) {
    this.bindings.unshift(createBinding(contract, factory))
  }

  public capture(contract: Contract, factory?: Factory) {
    const binding = createBinding(contract, factory)
    const capturedBinding = new CapturedBinding(contract, binding)

    this.bindings.unshift(capturedBinding)
  }

  public share(fn: BindFunction): void {
    const oldBindings = this.bindings
    this.bindings = this.sharedBindings

    try {
      fn(this)
    } finally {
      this.bindings = oldBindings
    }
  }

  public replicateFrom(bindingMap: BindingMap): void {
    bindingMap.bindings.forEach(b => this.bindings.push(b.replicate()))
  }

  public reset(): void {
    this.bindings.forEach(b => b.release())
    this.sharedBindings.forEach(b => b.release())

    this.bindings = []
    this.sharedBindings = []
  }
}
