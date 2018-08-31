import { HUNT_ANNOTATION_KEY } from "../hunt"
import { Class } from "../types"

import "reflect-metadata"

export default function PropertyInject(
  target: Class,
  name: string,
  descriptor: TypedPropertyDescriptor<Function> // tslint:disable-line
): void {
  const propertyKey = `__${name}__`
  const type = Reflect.getMetadata("design:type", target, name)

  Object.defineProperty(target.constructor.prototype, name, {
    configurable: false,
    get() {
      let value = this[propertyKey]
      if (value === undefined) {
        value = this[HUNT_ANNOTATION_KEY].fetch(type)
        this[propertyKey] = value
      }

      return value
    },
  })
}
