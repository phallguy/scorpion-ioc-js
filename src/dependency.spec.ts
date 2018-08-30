import Dependency from "./dependency"

class Root {}
class Base extends Root {}
class Derived extends Base {}
class EvenMoreDerived extends Derived {}
class Other {}

describe("Dependency", () => {
  it("should be defined", () => {
    expect(Dependency).toBeDefined()
  })

  it("requires a factory for string contracts", () => {
    expect(() => {
      new Dependency("NoFactory")
    }).toThrow()
  })

  describe(".satisfies", () => {
    describe("classes", () => {
      const dependency = new Dependency(Derived)

      it("is true for exact match", () => {
        expect(dependency.satisfies(Derived)).toBeTruthy()
      })

      it("is true for parent class", () => {
        expect(dependency.satisfies(Base)).toBeTruthy()
      })

      it("is true for grand parent class", () => {
        expect(dependency.satisfies(Root)).toBeTruthy()
      })

      it("is false for child class", () => {
        expect(dependency.satisfies(EvenMoreDerived)).toBeFalsy()
      })

      it("is false for unrelated class", () => {
        expect(dependency.satisfies(Other)).toBeFalsy()
      })
    })

    describe("strings", () => {
      const dependency = new Dependency("Connection", {}, () => ({}))

      it("is true for exact match", () => {
        expect(dependency.satisfies("Connection")).toBeTruthy()
      })

      it("is false for mismatch", () => {
        expect(dependency.satisfies("Whatever")).toBeFalsy()
      })
    })
  })
})
