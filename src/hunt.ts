import ClassBinding from "./bindings/classBinding"
import Scorpion from "./scorpion"
import { Contract } from "./types"

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

  public fetch(contract: Contract, args: any[]) {
    this.push(contract, args)
    try {
      return this.execute()
    } finally {
      this.pop()
    }
  }

  private execute() {
    return this.executeFromTrips() || this.executeFromSelf()
  }

  private executeFromTrips(): any {
    return this.trips.reduce((match, trip) => match || this.executeFromTrip(trip), undefined)
  }

  private executeFromTrip(trip?: Trip): any {
    if (!trip || !trip.instance) {
      return null
    }

    if (trip.instance instanceof this.contract) {
      return trip.instance
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

    return binding.fetch(this)
  }

  private push(contract: Contract, args: any[]) {
    if (this.trip) {
      this.trips.push(this.trip)
    }

    this.trip = new Trip(contract, args)
  }

  private pop() {
    this.trip = this.trips.pop() as Trip
  }
}
