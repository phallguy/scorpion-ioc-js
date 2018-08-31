import Binding from "../binding";
export default class FactoryBinding extends Binding {
    constructor(contract, factory) {
        super(contract);
        this.factory = factory;
    }
    fetch(hunt) {
        return this.factory(hunt);
    }
}
