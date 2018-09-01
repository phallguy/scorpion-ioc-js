/** @hidden */

import getHunt from "../getHunt"
import { Class } from "../types"

import "reflect-metadata"

/** @hidden */
export default function PropertyInject(
  target: Class<any>,
  name: string,
  descriptor: TypedPropertyDescriptor<Function> // tslint:disable-line
): void {
  const propertyKey = `__${name}__`

  // With ES5+ targets Reflect type defs are taken from automatically included ES2015
  // lib instead of the refelect-metadata module.
  // @ts-ignore:2339
  const type = Reflect.getMetadata("design:type", target, name)

  Object.defineProperty(target.constructor.prototype, name, {
    configurable: false,
    get() {
      let value = this[propertyKey]
      if (value === undefined) {
        value = getHunt(this).fetch(type)
        this[propertyKey] = value
      }

      return value
    },
  })
}
