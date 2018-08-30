import BindingMap from "./bindingMap";
import Hunt from "./hunt";
export default class Scorpion {
    constructor(parent) {
        this.parent = parent;
        this.bindingMap = new BindingMap();
    }
    /**
     * Fetch an instance of an object that satisfies the requested contract.
     *
     * @param contract The class of the object to fetch.
     */
    fetch(contract, ...args) {
        const hunt = new Hunt(this);
        return hunt.fetch(contract, args);
    }
    prepare(fn) {
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
