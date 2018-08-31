/**
 * A type describing an ES6 like class constructor.
 */
export interface Class<T> {
  new (...args: any[]): T
}

/**
 * Describes runtime methods automatically added to injected instances.
 */
export interface Injected {
  scorpion: Fetcher
}

/**
 * An [[Class]] or factory function that instantiate an object.
 *
 * @typeparam T The type of instances that satisfy the contract.
 */
export type Contract<T> = Class<T> // tslint:disable-line

export interface Fetcher {
  /**
   * Fetch an instance of an object that satisfies the requested contract.
   *
   * @param contract The class of the object to fetch.
   * @param args Additional arguments to pass to the constructor when
   * instantiating an instance of the `contract`.
   * @typeparam T The type of the `contract`.
   */
  fetch<T, U extends Injected & T>(contract: Contract<T>, ...args: any[]): U
}

/**
 * A [[Class]] that implements a static `create` method when instantiating an
 * instance requires some custom logic depending on the given arguments.
 */
export interface ClassWithCreate<T> extends Class<T> {
  /**
   * Creates a new instance of the class. Can use the provided `hunt` to
   * resolve any dependencies.
   *
   * @param fetcher A object that can fetch an instance from the [[Scorpion]]
   * container.
   * [[Class]].
   * @param args The additional arguments used to pass to the constructor.
   */
  create(fetcher: Fetcher, ...args: any[]): T
}
