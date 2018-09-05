import Scorpion, { PrepareFunction } from "./scorpion"

/**
 * A [[Scorpion]] nest is used to conceive instances of scorpions that have the
 * same bindings but manage the lifetimes of captured instances separately.
 */
export default class Nest {
  private readonly mother: Scorpion
  private locked: boolean = false

  /**
   * Creates a new Scorpion and optionally configures the bindings.
   *
   * @param prepare a callback function that maps the bindings. See
   * [[prepare]].
   */
  constructor(prepare?: PrepareFunction) {
    this.mother = new Scorpion(prepare)
  }

  /**
   * Prepare bindings for all scorpions [[conceive conceived]] in this nest.
   *
   * See [[BindingMap]] for lifetime methods.
   *
   * @param fn A callback function that maps the bindings.
   */
  public prepare(fn: PrepareFunction): void {
    if (this.locked) {
      throw new Error("Cannot prepare a nest after it has already conceived a scorpion.")
    }
    this.mother.prepare(fn)
  }

  /**
   * Conceives a new [[Scorpion]] prepared in the same way as the nest.
   */
  public conceive(): Promise<Scorpion> {
    this.locked = true
    return new Promise((resolve, reject) => resolve(this.mother.replicate()))
  }
}
