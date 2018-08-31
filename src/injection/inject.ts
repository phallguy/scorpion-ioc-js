import ParameterInject from "./parameterInject"
import PropertyInject from "./propertyInject"

export default function Inject(...args: any[]) {
  if (args.length < 3 || typeof args[2] === "undefined") {
    PropertyInject(args[0], args[1], args[2])
  } else if (args.length === 3 && typeof args[2] === "number") {
    ParameterInject(args[0], args[1], args[2])
  } else {
    throw new Error("Invalid @Inject Decorator declaration.")
  }
}
