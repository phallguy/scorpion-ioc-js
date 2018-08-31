import Binding from "../binding";
import "reflect-metadata";
export default class ClassBinding extends Binding {
    fetch(hunt) {
        const resolvedArgs = hunt.resolveArguments(this.contract);
        return new this.contract(...resolvedArgs);
    }
}
