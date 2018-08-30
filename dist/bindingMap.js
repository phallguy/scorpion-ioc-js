import CapturedBinding from "./bindings/capturedBinding";
import createBinding from "./createBinding";
export default class BindingMap {
    constructor() {
        this.bindings = [];
        this.sharedBindings = [];
    }
    find(contract) {
        return (this.bindings.find(b => b.isMatch(contract)) ||
            this.sharedBindings.find(b => b.isMatch(contract)) ||
            null);
    }
    bind(contract, factory) {
        this.bindings.unshift(createBinding(contract, factory));
    }
    capture(contract, factory) {
        const binding = createBinding(contract, factory);
        const capturedBinding = new CapturedBinding(contract, binding);
        this.bindings.unshift(capturedBinding);
    }
    share(fn) {
        const oldBindings = this.bindings;
        this.bindings = this.sharedBindings;
        try {
            fn(this);
        }
        finally {
            this.bindings = oldBindings;
        }
    }
    replicateFrom(bindingMap) {
        bindingMap.bindings.forEach(b => this.bindings.push(b.replicate()));
    }
    reset() {
        this.bindings.forEach(b => b.release());
        this.sharedBindings.forEach(b => b.release());
        this.bindings = [];
        this.sharedBindings = [];
    }
}
