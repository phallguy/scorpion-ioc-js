import ClassBinding from "./bindings/classBinding"
import Scorpion from "./scorpion"
import { Class, Contract } from "./types"

import "reflect-metadata"

export const HUNT_ANNOTATION_KEY = "__hunt__"
export const SCORPION_ANNOTATION_KEY = "scorpion"

// Limit how deep we'll go trying to resolve dependencies of dependencies.
// Anything this deep is almost certainly due to an unresolved circular
// dependency and we should die instead of enter an infinite loop.
const MAX_TRIP_DEPTH = 50

export default class Hunt {
  private trips: number = 0
  private _contract: Contract = Object
  private _args: any[] = []

  constructor(public readonly scorpion: Scorpion) { }

  get contract(): Contract {
    return this._contract 
  }

  get args(): any[] {
    return this._args || []
  }

  public fetch(contract: Contract, ...args: any[]) {
    const restore = this.push(contract, args)

    try {
      return this.fetchInstance()
    } finally {
      restore()
    }
  }

  public resolveArguments(contract: Contract): any[] {
    const paramTypes = Reflect.getMetadata("design:paramtypes", contract)
    if (!paramTypes) {
      return []
    }

    return paramTypes.map((param: Class, index: number) => {
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

  private push(contract: Contract, args: any[]) {
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
