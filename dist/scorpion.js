import BindingMap from "./bindingMap";
import Hunt from "./hunt";
export default class Scorpion {
    constructor(parentOrFunction) {
        this.bindingMap = new BindingMap();
        if (typeof parentOrFunction === "function") {
            this.prepare(parentOrFunction);
        }
        else {
            this.parent = parentOrFunction;
        }
    }
    /**
     * Fetch an instance of an object that satisfies the requested contract.
     *
     * @param contract The class of the object to fetch.
     */
    fetch(contract, ...args) {
        Object.freeze(this.bindingMap);
        const hunt = new Hunt(this);
        return hunt.fetch(contract, ...args);
    }
    prepare(fn) {
        if (Object.isFrozen(this.bindingMap)) {
            throw new Error("Cannot prepare after objects have been fetched.");
        }
        fn(this.bindingMap);
    }
    findBinding(contract) {
        let binding = this.bindingMap.find(contract);
        if (!binding && this.parent) {
            binding = this.parent.findBinding(contract);
        }
        return binding;
    }
    replicate() {
        const replica = new Scorpion(this);
        replica.bindingMap.replicateFrom(this.bindingMap);
        return replica;
    }
}
