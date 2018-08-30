import ClassBinding from "./bindings/classBinding";
import FactoryBinding from "./bindings/factoryBinding";
export default function createBinding(contract, factory) {
    if (factory) {
        return new FactoryBinding(contract, factory);
    }
    const createContract = contract;
    if (typeof createContract.create === "function") {
        return new FactoryBinding(contract, createContract.create);
    }
    return new ClassBinding(contract);
}
