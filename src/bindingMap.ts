import Binding, { Factory } from "./binding"
import CapturedBinding from "./bindings/capturedBinding"
import createBinding from "./createBinding"
import { Contract } from "./types"

/**
 * Callback function that configures bindings on a [[BindingMap]].
 *
 * @see [[BindingMap.bind]]
 * @see [[BindingMap.capture]]
 * @see [[BindingMap.share]]
 *
 * @param map map to define bindings on
 */
export type BindFunction = (map: BindingMap) => void

/**
 * Maintains associations between class contracts and the concrete
 * implementations of those contracts.
 */
export default class BindingMap {
  private bindings: Binding<any>[]
  private sharedBindings: Binding<any>[]

  constructor() {
    this.bindings = []
    this.sharedBindings = []
  }

  /**
   * Finds the [[Binding]] that is capable of materializing an instance of the
   * requested `contract`.
   *
   * @param contrct The type that describes the instance to be materialized.
   * @typeparam T The type of the resulting instance to be materialized.
   */
  public find<T>(contract: Contract<T>): Binding<T> | null {
    return (
      this.bindings.find(b => b.isMatch(contract)) ||
      this.sharedBindings.find(b => b.isMatch(contract)) ||
      null
    )
  }

  /**
   * Bind a concrete [[Contract]] to be used when hunting instances of the
   * contract or any parent type.
   *
   * Each hunt will return a *new instance* of type `T` each time a client tries
   * to fetch an instance of the given `contract`.
   *
   * @param contract The type that describes the instance to be materialized.
   * @param factory A factory function used for materializing instances of the
   * type `T`.
   * @typeparam T The type of `contract` instances.
   */
  public bind<T>(contract: Contract<T>, factory?: Factory<T>) {
    this.bindings.unshift(createBinding(contract, factory))
  }

  /**
   * Bind a concrete [[Contract]] to be used when hunting instances of the
   * contract or any parent type.
   *
   * Each hunt will return *the same instance* of type `T` each time a client tries
   * to fetch an instance of the given `contract`.
   *
   * @param contract The type that describes the instance to be materialized.
   * @param factory A factory function used for materializing instances of the
   * type `T`.
   * @typeparam T The type of `contract` instances.
   */
  public capture<T>(contract: Contract<T>, factory?: Factory<T>) {
    const binding = createBinding(contract, factory)
    const capturedBinding = new CapturedBinding(contract, binding)

    this.bindings.unshift(capturedBinding)
  }

  /**
   * When preparing a [[Nest]] any [[capture captured]] binding will share
   * resolved instances with child [[Scorpion scorpions]].
   *
   * @param fn A callback function that receives an instance of the
   * [[BindingMap]] to define the shared bindings.
   */
  public share(fn: BindFunction): void {
    const oldBindings = this.bindings
    this.bindings = this.sharedBindings

    try {
      fn(this)
    } finally {
      this.bindings = oldBindings
    }
  }

  /**
   * @hidden
   */
  public replicateFrom(bindingMap: BindingMap): void {
    bindingMap.bindings.forEach(b => this.bindings.push(b.replicate()))
  }

  /**
   * Resets and bindings and releases any held resources.
   */
  public reset(): void {
    this.bindings.forEach(b => b.release())
    this.sharedBindings.forEach(b => b.release())

    this.bindings = []
    this.sharedBindings = []
  }
}
