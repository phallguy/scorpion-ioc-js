import { Factory } from "./binding"
import ClassBinding from "./bindings/classBinding"
import FactoryBinding from "./bindings/factoryBinding"
import { ClassWithCreate, Contract } from "./types"

export default function createBinding(contract: Contract, factory?: Factory) {
  if (factory) {
    return new FactoryBinding(contract, factory)
  }

  const createContract = contract as ClassWithCreate
  if (typeof createContract.create === "function") {
    return new FactoryBinding(contract, createContract.create)
  }

  return new ClassBinding(contract)
}
