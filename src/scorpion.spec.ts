import BindingMap from "./bindingMap"
import Hunt from "./hunt"
import Scorpion from "./scorpion"

class Example {}
class DerivedExample extends Example {}

describe("container", () => {
  it("is defined", () => {
    expect(Scorpion).toBeDefined()
  })

  describe(".constructor", () => {
    it("assigns a parent if given", () => {
      const parent = new Scorpion()
      const scorpion = new Scorpion(parent)

      // @ts-ignore:2341
      expect(scorpion.parent).toBe(parent)
    })

    it("prepare scorpion if function given", () => {
      const fn = jest.fn()
      new Scorpion(fn)

      expect(fn).toHaveBeenCalledWith(expect.any(BindingMap))
    })
  })

  describe(".fetch", () => {
    it("returns an instance of the desired contract", async () => {
      const scorpion = new Scorpion()
      const example = await scorpion.fetch(Example)

      expect(example).toBeInstanceOf(Example)
    })

    it("returns an instance of built in classes", async () => {
      const scorpion = new Scorpion()
      const now = await scorpion.fetch(Date)

      expect(now).toBeInstanceOf(Date)
    })

    it("freezes the binding map", () => {
      const scorpion = new Scorpion()
      scorpion.fetch(Example)

      expect(() => {
        scorpion.prepare(() => {})
      }).toThrow(/fetched/)
    })

    it("gets a new instance for standard contracts", async () => {
      const scorpion = new Scorpion()
      scorpion.prepare(map => {
        map.bind(DerivedExample)
      })

      const example = await scorpion.fetch(Example)
      const nextExample = await scorpion.fetch(Example)

      expect(example).not.toBe(nextExample)
    })

    it("gets the same instance for captured contracts", async () => {
      const scorpion = new Scorpion()
      scorpion.prepare(map => {
        map.capture(DerivedExample)
      })

      const example = await scorpion.fetch(Example)
      const nextExample = await scorpion.fetch(Example)

      expect(example).toBe(nextExample)
    })

    it("invokes the factory method if given", async () => {
      const factory = jest.fn(async h => new Example())
      const scorpion = new Scorpion(map => {
        map.bind(Example, factory)
      })

      await scorpion.fetch(Example)
      expect(factory).toHaveBeenCalledWith(expect.any(Hunt))
    })

    describe("when replicated", () => {
      it("gets normal bindinds", async () => {
        const scorpion = new Scorpion()
        scorpion.prepare(map => {
          map.bind(DerivedExample)
        })
        const replica = scorpion.replicate()

        const example = await replica.fetch(Example)

        expect(example).toBeInstanceOf(DerivedExample)
      })

      it("gets shared bindings", async () => {
        const scorpion = new Scorpion()
        scorpion.prepare(map => {
          map.share(() => {
            map.bind(DerivedExample)
          })
        })
        const replica = scorpion.replicate()
        const example = await replica.fetch(Example)

        expect(example).toBeInstanceOf(DerivedExample)
      })

      it("does not get the same instance for captured contracts", async () => {
        const scorpion = new Scorpion()
        scorpion.prepare(map => {
          map.capture(DerivedExample)
        })
        const example = scorpion.fetch(Example)

        const replica = scorpion.replicate()
        const nextExample = await replica.fetch(Example)

        expect(example).not.toBe(nextExample)
      })

      it("gets the same instance for shared and captured contracts", async () => {
        const scorpion = new Scorpion()
        scorpion.prepare(map => {
          map.share(() => {
            map.capture(DerivedExample)
          })
        })
        const example = await scorpion.fetch(Example)

        const replica = scorpion.replicate()
        const nextExample = await replica.fetch(Example)

        expect(example).toBe(nextExample)
      })
    })
  })
})
