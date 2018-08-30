import Hunt from "./hunt";
export default class Scorpion {
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Fetch an instance of an object that satisfies the requested contract.
     *
     * @param contract The class of the object to fetch.
     */
    fetch(contract, ...args) {
        return this.execute(new Hunt(this, contract, args));
    }
    inject(target) { }
    /**
     * Executes a {Hunt}, returning the discovered instance.
     */
    execute(hunt) { }
}
