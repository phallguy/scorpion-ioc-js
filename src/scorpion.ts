import Binding from "./binding"
import BindingMap, { BindFunction } from "./bindingMap"
import Hunt from "./hunt"
import { Contract, Fetcher, Injected } from "./types"

/**
 * Prepares bindings for a scorpion.
 */
export type PrepareFunction = BindFunction

/**
 * An IoC container.
 *
 * Each container is configured with one or more [[Binding bindings]] that map
 * a class to the concrete implementation that should be resolved.
 */
export default class Scorpion implements Fetcher {
  private readonly bindingMap: BindingMap
  private readonly parent?: Scorpion

  /**
   * Creates a new Scorpion and optionally configures the bindings.
   *
   * @param prepare a callback function that maps the bindings. See
   * [[prepare]].
   */
  constructor(prepare?: PrepareFunction)

  /**
   * [Internal] do not user
   */
  constructor(parent?: Scorpion) // tslint:disable-line
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
   * @param args Additional arguments to pass to the constructor when
   * instantiating an instance of the contract.
   * @typeparam T The type of the `contract`.
   */
  public async fetch<T, U extends Injected & T>(contract: Contract<T>, ...args: any[]): Promise<U> {
    Object.freeze(this.bindingMap)

    const hunt = new Hunt(this)
    return hunt.fetch(contract, ...args) as Promise<U>
  }

  /**
   * Prepare bindings on the scorpion that map classes to concrete
   * implementations and the lifetimes of the returned instances.
   *
   * See [[BindingMap]] for lifetime methods.
   *
   * @param fn A callback function that maps the bindings.
   */
  public prepare(fn: PrepareFunction): void {
    if (Object.isFrozen(this.bindingMap)) {
      throw new Error("Cannot prepare after objects have been fetched.")
    }

    fn(this.bindingMap)
  }

  /**
   * Finds the [[Binding]] that defines the strategy used for materializing
   * instances of a `contract`.
   *
   * @param contract The class of the object that will be materialized.
   */
  public findBinding<T>(contract: Contract<T>): Binding<T> | null {
    let binding = this.bindingMap.find(contract)

    if (!binding && this.parent) {
      binding = this.parent.findBinding(contract)
    }

    return binding
  }

  /**
   * Returns a new instance of a [[Scorpion]] with the same binding
   * configuration. Instances fetched from the replicated scorpion will be
   * scoped to the new scorpion.
   */
  public replicate(): Scorpion {
    const replica = new Scorpion(this)
    replica.bindingMap.replicateFrom(this.bindingMap)

    return replica
  }
}
