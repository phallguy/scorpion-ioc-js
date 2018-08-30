import Binding from "./binding"

class Root {}
class Base extends Root {}
class Derived extends Base {}
class EvenMoreDerived extends Derived {}
class Other {}

class TestBinding extends Binding {}

describe("Binding", () => {
  it("should be defined", () => {
    expect(Binding).toBeDefined()
  })

  describe(".isMatch", () => {
    const dependency = new TestBinding(Derived)

    it("is true for exact match", () => {
      expect(dependency.isMatch(Derived)).toBeTruthy()
    })

    it("is true for parent class", () => {
      expect(dependency.isMatch(Base)).toBeTruthy()
    })

    it("is true for grand parent class", () => {
      expect(dependency.isMatch(Root)).toBeTruthy()
    })

    it("is false for child class", () => {
      expect(dependency.isMatch(EvenMoreDerived)).toBeFalsy()
    })

    it("is false for unrelated class", () => {
      expect(dependency.isMatch(Other)).toBeFalsy()
    })
  })
})
