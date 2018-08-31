import { Factory } from "./binding"
import ClassBinding from "./bindings/classBinding"
import FactoryBinding from "./bindings/factoryBinding"
import { ClassWithCreate, Contract } from "./types"

/**
 * Creates a [[Binding]] that can be used to materialize instances of given
 * contract type.
 *
 * @param contract The class used to create instances of the desired type.
 * @param factory A factory function used to materialize instances.
 * @typeparam T The type of instances created by the contract.
 */
export default function createBinding<T>(contract: Contract<T>, factory?: Factory<T>) {
  if (factory) {
    return new FactoryBinding(contract, factory)
  }

  const createContract = contract as ClassWithCreate<T>
  if (typeof createContract.create === "function") {
    return new FactoryBinding(contract, createContract.create)
  }

  return new ClassBinding(contract)
}
