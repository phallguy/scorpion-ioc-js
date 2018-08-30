import Hunt from "./hunt"
import { Contract } from "./types"

export default class Scorpion {
  constructor(private parent?: Scorpion) {}

  /**
   * Fetch an instance of an object that satisfies the requested contract.
   *
   * @param contract The class of the object to fetch.
   */
  fetch(contract: Contract, ...args: any[]): any {
    return this.execute(new Hunt(this, contract, args))
  }

  inject(target: object): void {}

  /**
   * Executes a {Hunt}, returning the discovered instance.
   */
  private execute(hunt: Hunt): any {}
}
