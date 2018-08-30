import Dependency from "./dependency";
export default class DependencyMap {
    constructor(scorpion) {
        this.scorpion = scorpion;
        this.bindings = this.activeBindings = [];
        this.sharedBindings = [];
    }
    find(contract) {
        throw new Error("Nope");
    }
    bind(contract, options = {}, factory) {
        this.activeBindings.push(new Dependency(contract, options, factory));
    }
    reset() {
        // todo release
        this.bindings = this.activeBindings = [];
        this.sharedBindings = [];
    }
}
