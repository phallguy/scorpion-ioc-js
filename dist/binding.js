import isDerived from "./lib/isDerived";
export default class Binding {
    constructor(contract) {
        this.contract = contract;
    }
    isMatch(contract) {
        return isDerived(this.contract, contract);
    }
    fetch(hunt) {
        throw new Error("Not implemented");
    }
    release() { }
    replicate() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}
