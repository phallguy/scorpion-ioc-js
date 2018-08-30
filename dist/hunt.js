import ClassBinding from "./bindings/classBinding";
export default class Hunt {
    constructor(scorpion, contract, args) {
        this.scorpion = scorpion;
        this.contract = contract;
        this.args = args;
    }
    execute(explicitOnly = false) {
        let binding = this.scorpion.findBinding(this.contract);
        if (!binding && !explicitOnly) {
            binding = new ClassBinding(this.contract);
        }
        if (!binding) {
            throw new Error("Cannot resolve dependency");
        }
        return binding.fetch(this);
    }
}
