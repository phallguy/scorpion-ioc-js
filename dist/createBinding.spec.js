import ClassBinding from "./bindings/classBinding";
import FactoryBinding from "./bindings/factoryBinding";
import createBinding from "./createBinding";
class Example {
}
class CreateExample {
    static create(hunt) { }
}
describe("createBinding", () => {
    it("creates a class binding for a simple class", () => {
        const binding = createBinding(Example);
        expect(binding).toBeInstanceOf(ClassBinding);
    });
    it("creates a factory binding when given a factory", () => {
        const binding = createBinding(Example, () => { });
        expect(binding).toBeInstanceOf(FactoryBinding);
    });
    it("creates a factory binding if the class has a static .create method", () => {
        const binding = createBinding(CreateExample);
        expect(binding).toBeInstanceOf(FactoryBinding);
    });
});
