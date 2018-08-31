import ParameterInject from "./parameterInject"
import PropertyInject from "./propertyInject"

/**
 * Decorates a class property or constructor argument to designate a
 * dependency that should be injected when the instance is materialized
 * by a [[Scorpion]].
 *
 * Constructor arguments are resolved immediately when the instance is first
 * materialized. Properties are resolved lazily the first time they are
 * referenced.
 *
 * ```typescript
 * class UserService {
 *    @Inject private readonly logger: Logger
 *
 *    constructor( @Inject repo: UserRepository ) {}
 * }
 * ```
 */
export default function Inject(...args: any[]) {
  if (args.length < 3 || typeof args[2] === "undefined") {
    PropertyInject(args[0], args[1], args[2])
  } else if (args.length === 3 && typeof args[2] === "number") {
    ParameterInject(args[0], args[1], args[2])
  } else {
    throw new Error("Invalid @Inject Decorator declaration.")
  }
}
