import isDerived from "./lib/isDerived";
export default class Dependency {
    constructor(contract, options, factory) {
        this.contract = contract;
        this.options = options;
        this.factory = factory;
        if (typeof contract === "string" && !factory) {
            throw new Error("String contracts must have a factory method");
        }
    }
    satisfies(contract) {
        if (typeof this.contract === "string") {
            if (typeof contract === "string") {
                return this.contract === contract;
            }
        }
        else {
            if (typeof contract !== "string") {
                return isDerived(this.contract, contract);
            }
        }
        return false;
    }
    release() { }
}
