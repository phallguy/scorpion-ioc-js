import Binding, { Factory } from "./binding"
import CapturedBinding from "./bindings/capturedBinding"
import createBinding from "./createBinding"
import { Contract } from "./types"

/**
 * Callback function that configures bindings on a [[BindingMap]].
 *
 * @param map map to define bindings on
 *
 * @see [[BindingMap.bind]]
 * @see [[BindingMap.capture]]
 * @see [[BindingMap.share]]
 *
 */
export type BindFunction = (map: BindingMap) => void

export default class BindingMap {
  private bindings: Binding<any>[]
  private sharedBindings: Binding<any>[]

  constructor() {
    this.bindings = []
    this.sharedBindings = []
  }

  public find<T>(contract: Contract<T>): Binding<T> | null {
    return (
      this.bindings.find(b => b.isMatch(contract)) ||
      this.sharedBindings.find(b => b.isMatch(contract)) ||
      null
    )
  }

  public bind<T>(contract: Contract<T>, factory?: Factory<T>) {
    this.bindings.unshift(createBinding(contract, factory))
  }

  public capture<T>(contract: Contract<T>, factory?: Factory<T>) {
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
