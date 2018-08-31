import BindingMap from "./bindingMap";
import Scorpion from "./scorpion";
class Example {
}
class DerivedExample extends Example {
}
describe("container", () => {
    it("is defined", () => {
        expect(Scorpion).toBeDefined();
    });
    describe(".constructor", () => {
        it("assigns a parent if given", () => {
            const parent = new Scorpion();
            const scorpion = new Scorpion(parent);
            expect(scorpion.parent).toBe(parent);
        });
        it("prepare scorpion if function given", () => {
            const fn = jest.fn();
            new Scorpion(fn);
            expect(fn).toHaveBeenCalledWith(expect.any(BindingMap));
        });
    });
    describe(".fetch", () => {
        it("returns an instance of the desired contract", () => {
            const scorpion = new Scorpion();
            const example = scorpion.fetch(Example);
            expect(example).toBeInstanceOf(Example);
        });
        it("gets a new instance for standard contracts", () => {
            const scorpion = new Scorpion();
            scorpion.prepare(map => {
                map.bind(DerivedExample);
            });
            const example = scorpion.fetch(Example);
            const nextExample = scorpion.fetch(Example);
            expect(example).not.toBe(nextExample);
        });
        it("gets the same instance for captured contracts", () => {
            const scorpion = new Scorpion();
            scorpion.prepare(map => {
                map.capture(DerivedExample);
            });
            const example = scorpion.fetch(Example);
            const nextExample = scorpion.fetch(Example);
            expect(example).toBe(nextExample);
        });
        describe("when replicated", () => {
            it("gets normal bindinds", () => {
                const scorpion = new Scorpion();
                scorpion.prepare(map => {
                    map.bind(DerivedExample);
                });
                const replica = scorpion.replicate();
                const example = replica.fetch(Example);
                expect(example).toBeInstanceOf(DerivedExample);
            });
            it("gets shared bindings", () => {
                const scorpion = new Scorpion();
                scorpion.prepare(map => {
                    map.share(() => {
                        map.bind(DerivedExample);
                    });
                });
                const replica = scorpion.replicate();
                const example = replica.fetch(Example);
                expect(example).toBeInstanceOf(DerivedExample);
            });
            it("does not get the same instance for captured contracts", () => {
                const scorpion = new Scorpion();
                scorpion.prepare(map => {
                    map.capture(DerivedExample);
                });
                const example = scorpion.fetch(Example);
                const replica = scorpion.replicate();
                const nextExample = replica.fetch(Example);
                expect(example).not.toBe(nextExample);
            });
            it("gets the same instance for shared and captured contracts", () => {
                const scorpion = new Scorpion();
                scorpion.prepare(map => {
                    map.share(() => {
                        map.capture(DerivedExample);
                    });
                });
                const example = scorpion.fetch(Example);
                const replica = scorpion.replicate();
                const nextExample = replica.fetch(Example);
                expect(example).toBe(nextExample);
            });
        });
    });
});
