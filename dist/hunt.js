import ClassBinding from "./bindings/classBinding";
import "reflect-metadata";
export const HUNT_ANNOTATION_KEY = "__hunt__";
// Limit how deep we'll go trying to resolve dependencies of dependencies.
// Anything this deep is almost certainly due to an unresolved circular
// dependency and we should die instead of enter an infinite loop.
const MAX_TRIP_DEPTH = 50;
class Trip {
    constructor(contract, args) {
        this.contract = contract;
        this.args = args;
    }
}
export default class Hunt {
    constructor(scorpion) {
        this.scorpion = scorpion;
        this.trips = [];
        this.trip = null;
    }
    get contract() {
        return this.trip && this.trip.contract;
    }
    get args() {
        return this.trip && this.trip.args;
    }
    fetch(contract, ...args) {
        this.push(contract, args);
        try {
            return this.execute();
        }
        finally {
            this.pop();
        }
    }
    resolveArguments(contract) {
        const paramTypes = Reflect.getMetadata("design:paramtypes", contract);
        if (!paramTypes) {
            return [];
        }
        return paramTypes.map((param, index) => {
            let value = this.args[index];
            if (value === undefined) {
                value = this.fetch(param);
            }
            return value;
        });
    }
    execute() {
        const instance = (this.trip.instance = this.executeFromTrips() || this.executeFromSelf());
        if (!instance) {
            throw new Error(`Could not resolve ${this.contract}`);
        }
        return instance;
    }
    executeFromTrips() {
        return this.trips.reduce((match, trip) => match || this.executeFromTrip(trip), undefined);
    }
    executeFromTrip(trip) {
        if (!trip) {
            return null;
        }
        if (trip.instance instanceof this.contract) {
            return trip.instance;
        }
        else if (!trip.instance && trip.contract === this.contract) {
            throw new Error(`Circular dependency ${this.contract.name} must be passed explicitly.`);
        }
        return null;
    }
    executeFromSelf() {
        if (!this.contract) {
            throw new Error("Cannot execute hunt, no current contract");
        }
        let binding = this.scorpion.findBinding(this.contract);
        if (!binding) {
            binding = new ClassBinding(this.contract);
        }
        const instance = binding.fetch(this);
        if (!(HUNT_ANNOTATION_KEY in instance)) {
            Object.defineProperty(instance, HUNT_ANNOTATION_KEY, { value: this, writable: false });
        }
        return instance;
    }
    push(contract, args) {
        if (this.trip) {
            if (this.trips.length >= MAX_TRIP_DEPTH) {
                throw new Error("Too many trips. There is probably a circular dependency that cannot be resolved.");
            }
            this.trips.push(this.trip);
        }
        this.trip = new Trip(contract, args);
    }
    pop() {
        this.trip = this.trips.pop();
    }
}
