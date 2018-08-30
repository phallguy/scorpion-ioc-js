import Binding from "../binding";
export default class ClassBinding extends Binding {
    fetch(hunt) {
        return new this.contract(...hunt.args);
    }
}
