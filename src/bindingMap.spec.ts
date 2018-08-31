import BindingMap from "./bindingMap"

class Example {}
class AnotherExample extends Example {}
class SharedExample extends Example {}
class Missing {}

describe("BindingMap", () => {
  it("should be defined", () => {
    expect(BindingMap).toBeDefined()
  })

  describe(".find", () => {
    it("returns null when nothing bound", () => {
      const bindingMap = new BindingMap()
      const binding = bindingMap.find(Missing)

      expect(binding).toBeNull()
    })

    it("finds explicit class binding", () => {
      const bindingMap = new BindingMap()
      bindingMap.bind(Example)
      const binding = bindingMap.find(Example)

      expect(binding).not.toBeNull()
    })

    it("finds shared class binding", () => {
      const bindingMap = new BindingMap()
      bindingMap.share(map => {
        map.bind(Example)
      })
      const binding = bindingMap.find(Example)

      expect(binding).not.toBeNull()
    })

    it("uses explict class over shared binding", () => {
      const bindingMap = new BindingMap()
      bindingMap.bind(Example)
      bindingMap.share(map => {
        map.bind(SharedExample)
      })

      const binding = bindingMap.find(Example)

      expect(binding).not.toBeNull()
      expect(binding.contract).toBe(Example)
    })

    it("finds the last bound first", () => {
      const bindingMap = new BindingMap()
      bindingMap.bind(AnotherExample)
      bindingMap.bind(Example)

      const binding = bindingMap.find(Example)

      expect(binding.contract).toBe(Example)
    })
  })

  describe(".replicateFrom", () => {
    it("replicates bindings", () => {
      const bindingMap = new BindingMap()
      bindingMap.bind(Example)
      const replica = new BindingMap()
      replica.replicateFrom(bindingMap)

      const binding = bindingMap.find(Example)
      const replicaBinding = replica.find(Example)

      expect(replicaBinding).not.toBe(binding)
      expect(replicaBinding).toBeDefined()
    })

    it("does not replicate shared bindings", () => {
      const bindingMap = new BindingMap()
      bindingMap.share(() => {
        bindingMap.bind(Example)
      })
      const replica = new BindingMap()
      replica.replicateFrom(bindingMap)

      const replicaBinding = replica.find(Example)

      expect(replicaBinding).toBeNull()
    })
  })

  describe(".reset", () => {
    it("releases bindings", () => {
      const bindingMap = new BindingMap()
      bindingMap.bind(Example)

      const binding = bindingMap.find(Example)
      binding.release = jest.fn()

      bindingMap.reset()

      expect(binding.release).toHaveBeenCalled()
    })

    it("releases shared bindings", () => {
      const bindingMap = new BindingMap()
      bindingMap.share(map => {
        map.bind(Example)
      })

      const binding = bindingMap.find(Example)
      binding.release = jest.fn()

      bindingMap.reset()

      expect(binding.release).toHaveBeenCalled()
    })

    it("removes bindings", () => {
      const bindingMap = new BindingMap()
      bindingMap.bind(Example)
      bindingMap.reset()

      expect(bindingMap.find(Example)).toBeNull()
    })

    it("removes shared bindings", () => {
      const bindingMap = new BindingMap()
      bindingMap.share(map => {
        map.bind(Example)
      })

      bindingMap.reset()
      expect(bindingMap.find(Example)).toBeNull()
    })
  })
})
