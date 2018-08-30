import Binding from "../binding";
export default class CapturedBinding extends Binding {
    constructor(contract, binding) {
        super(contract);
        this.binding = binding;
    }
    fetch(hunt) {
        if (!this.instance) {
            this.instance = this.binding.fetch(hunt);
        }
        return this.instance;
    }
    isMatch(contract) {
        return this.binding.isMatch(contract);
    }
    release() {
        this.instance = null;
    }
    replicate() {
        const replicated = super.replicate();
        replicated.release();
        return replicated;
    }
}
