import Binding from "../binding";
import "reflect-metadata";
export default class ClassBinding extends Binding {
    fetch(hunt) {
        const resolvedArgs = hunt.resolveArguments(this.contract);
        const instance = new this.contract(...resolvedArgs);
        return instance;
    }
}
