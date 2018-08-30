import ClassBinding from "./bindings/classBinding";
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
    fetch(contract, args) {
        this.push(contract, args);
        try {
            return this.execute();
        }
        finally {
            this.pop();
        }
    }
    execute() {
        return this.executeFromTrips() || this.executeFromSelf();
    }
    executeFromTrips() {
        return this.trips.reduce((match, trip) => match || this.executeFromTrip(trip), undefined);
    }
    executeFromTrip(trip) {
        if (!trip || !trip.instance) {
            return null;
        }
        if (trip.instance instanceof this.contract) {
            return trip.instance;
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
        return binding.fetch(this);
    }
    push(contract, args) {
        if (this.trip) {
            this.trips.push(this.trip);
        }
        this.trip = new Trip(contract, args);
    }
    pop() {
        this.trip = this.trips.pop();
    }
}
