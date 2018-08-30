import Hunt from './hunt'

export default abstract class Scorpion {
  /**
   * Fetch an instance of an object that satisfies the requested contract.
   *
   * @param contract The class of the object to fetch.
   */
  fetch(contract: function, ...args): anyt {}

  inject(target: object): void {}

  /**
   * Executes a {Hunt}, returning the discovered instance.
   */
  execute(hunt: Hunt): any {}
}
