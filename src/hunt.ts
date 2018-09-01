import ClassBinding from "./bindings/classBinding"
import Scorpion from "./scorpion"
import { Class, Contract, Fetcher, Injected } from "./types"

import "reflect-metadata"

/** @hidden */
export const HUNT_ANNOTATION_KEY = "__hunt__"

/** @hidden */
export const SCORPION_ANNOTATION_KEY = "scorpion"

// Limit how deep we'll go trying to resolve dependencies of dependencies.
// Anything this deep is almost certainly due to an unresolved circular
// dependency and we should die instead of enter an infinite loop.
const MAX_TRIP_DEPTH = 50

/**
 * Provides context and [[Binding]] resolution for a [[Scorpion.fetch]]
 * request and all the dependencies required to satisfy that request.
 */
export default class Hunt implements Fetcher {
  private trips: number = 0
  private _contract: Contract<any> = Object
  private _args: any[] = []

  /**
   * @param scorpion The [[Scorpion]] executing a hunt.
   */
  constructor(private readonly scorpion: Scorpion) {}

  /**
   * The current [[Contract]] being hunted.
   */
  get contract(): Contract<any> {
    return this._contract
  }

  /**
   * The constructor arguments to use when the [[contract]] is found.
   */
  get args(): any[] {
    return this._args || []
  }

  /**
   * Fetch an instance of an object that satisfies the requested contract.
   *
   * @param contract The class of the object to fetch.
   * @param args Additional arguments to pass to the constructor when
   * instantiating an instance of the contract.
   * @typeparam T The type of the `contract`.
   */
  public fetch<T, U extends Injected & T>(contract: Contract<T>, ...args: any[]): U {
    const restore = this.push(contract, args)

    try {
      return this.fetchInstance()
    } finally {
      restore()
    }
  }

  /**
   * Resolves any arguments needed by the constructor of the current
   * [[contract]].
   *
   * @param contract The contract of the [[Binding]] that was resolved to
   * satisfy the current [[contract]] being hunted.
   */
  public resolveArguments<T>(contract: Contract<T>): any[] {
    // With ES5+ targets Reflect type defs are taken from automatically included ES2015
    // lib instead of the refelect-metadata module.
    // @ts-ignore:2339
    const paramTypes = Reflect.getMetadata("design:paramtypes", contract) 
    if (!paramTypes) {
      return []
    }

    return paramTypes.map((param: Class<any>, index: number) => {
      let value = this.args[index]
      if (value === undefined) {
        value = this.fetch(param)
      }
      return value
    })
  }

  private fetchInstance() {
    let binding = this.scorpion.findBinding(this.contract)

    if (!binding) {
      binding = new ClassBinding(this.contract)
    }

    const instance = binding.fetch(this)

    if (!(HUNT_ANNOTATION_KEY in instance)) {
      Object.defineProperty(instance, HUNT_ANNOTATION_KEY, { value: this, writable: false })
      Object.defineProperty(instance, SCORPION_ANNOTATION_KEY, {
        value: this.scorpion,
        writable: false,
      })
    }

    return instance
  }

  private push(contract: Contract<any>, args: any[]) {
    if (this.trips >= MAX_TRIP_DEPTH) {
      throw new Error(
        "Too many trips. There is probably a circular dependency that cannot be resolved."
      )
    }

    const oldContract = this.contract
    const oldArgs = this.args

    this._contract = contract
    this._args = args

    this.trips++

    return () => {
      this.trips--

      this._contract = oldContract
      this._args = oldArgs
    }
  }
}
