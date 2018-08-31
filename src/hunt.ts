import ClassBinding from "./bindings/classBinding"
import Scorpion from "./scorpion"
import { Contract, Class } from "./types"

import "reflect-metadata"

export const HUNT_ANNOTATION_KEY = "__hunt__"

// Limit how deep we'll go trying to resolve dependencies of dependencies.
// Anything this deep is almost certainly due to an unresolved circular
// dependency and we should die instead of enter an infinite loop.
const MAX_TRIP_DEPTH = 50

class Trip {
  public instance: any
  constructor(public readonly contract: Contract, public readonly args: any[]) {}
}

export default class Hunt {
  private readonly trips: Trip[] = []
  private trip: Trip = null!

  constructor(public readonly scorpion: Scorpion) {}

  get contract(): Contract {
    return this.trip && this.trip.contract
  }

  get args(): any[] {
    return this.trip && this.trip.args
  }

  public fetch(contract: Contract, ...args: any[]) {
    this.push(contract, args)
    try {
      return this.execute()
    } finally {
      this.pop()
    }
  }

  public resolveArguments( contract: Contract ): any[] {
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

  private execute() {
    const instance = (this.trip.instance = this.executeFromTrips() || this.executeFromSelf())
    if (!instance) {
      throw new Error(`Could not resolve ${this.contract}`)
    }

    return instance
  }

  private executeFromTrips(): any {
    return this.trips.reduce((match, trip) => match || this.executeFromTrip(trip), undefined)
  }

  private executeFromTrip(trip?: Trip): any {
    if (!trip) {
      return null
    }

    if (trip.instance instanceof this.contract) {
      return trip.instance
    } else if (!trip.instance && trip.contract === this.contract) {
      throw new Error(`Circular dependency ${ this.contract.name } must be passed explicitly.`)
    }

    return null
  }

  private executeFromSelf(): any {
    if (!this.contract) {
      throw new Error("Cannot execute hunt, no current contract")
    }

    let binding = this.scorpion.findBinding(this.contract)

    if (!binding) {
      binding = new ClassBinding(this.contract)
    }

    const instance = binding.fetch(this)

    if (!(HUNT_ANNOTATION_KEY in instance)) {
      Object.defineProperty(instance, HUNT_ANNOTATION_KEY, { value: this, writable: false })
    }

    return instance
  }

  private push(contract: Contract, args: any[]) {
    if (this.trip) {
      if (this.trips.length >= MAX_TRIP_DEPTH) {
        throw new Error(
          "Too many trips. There is probably a circular dependency that cannot be resolved."
        )
      }

      this.trips.push(this.trip)
    }

    this.trip = new Trip(contract, args)
  }

  private pop() {
    this.trip = this.trips.pop() as Trip
  }
}
