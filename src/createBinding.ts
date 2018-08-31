import { Factory } from "./binding"
import ClassBinding from "./bindings/classBinding"
import FactoryBinding from "./bindings/factoryBinding"
import { ClassWithCreate, Contract } from "./types"

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
