import Scorpion from "./scorpion"

class Example {}
class DerivedExample extends Example {}

describe("container", () => {
  it("is defined", () => {
    expect(Scorpion).toBeDefined()
  })

  describe(".fetch", () => {
    it("returns an instance of the desired contract", () => {
      const scorpion = new Scorpion()
      const example = scorpion.fetch(Example)

      expect(example).toBeInstanceOf(Example)
    })

    it("gets a new instance for standard contracts", () => {
      const scorpion = new Scorpion()
      scorpion.prepare(map => {
        map.bind(DerivedExample)
      })

      const example = scorpion.fetch(Example)
      const nextExample = scorpion.fetch(Example)

      expect(example).not.toBe(nextExample)
    })

    it("gets the same instance for captured contracts", () => {
      const scorpion = new Scorpion()
      scorpion.prepare(map => {
        map.capture(DerivedExample)
      })

      const example = scorpion.fetch(Example)
      const nextExample = scorpion.fetch(Example)

      expect(example).toBe(nextExample)
    })

    describe("when replicated", () => {
      it("gets normal bindinds", () => {
        const scorpion = new Scorpion()
        scorpion.prepare(map => {
          map.bind(DerivedExample)
        })
        const replica = scorpion.replicate()

        const example = replica.fetch(Example)

        expect(example).toBeInstanceOf(DerivedExample)
      })

      it("gets shared bindings", () => {
        const scorpion = new Scorpion()
        scorpion.prepare(map => {
          map.share(() => {
            map.bind(DerivedExample)
          })
        })
        const replica = scorpion.replicate()
        const example = replica.fetch(Example)

        expect(example).toBeInstanceOf(DerivedExample)
      })

      it("does not get the same instance for captured contracts", () => {
        const scorpion = new Scorpion()
        scorpion.prepare(map => {
          map.capture(DerivedExample)
        })
        const example = scorpion.fetch(Example)

        const replica = scorpion.replicate()
        const nextExample = replica.fetch(Example)

        expect(example).not.toBe(nextExample)
      })

      it("gets the same instance for shared and captured contracts", () => {
        const scorpion = new Scorpion()
        scorpion.prepare(map => {
          map.share(() => {
            map.capture(DerivedExample)
          })
        })
        const example = scorpion.fetch(Example)

        const replica = scorpion.replicate()
        const nextExample = replica.fetch(Example)

        expect(example).toBe(nextExample)
      })
    })
  })
})
