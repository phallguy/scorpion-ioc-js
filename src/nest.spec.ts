import Scorpion from "./scorpion"
import Nest from "./nest"

describe("Nest", () => {
  describe(".prepare", () => {
    it("fails if already conceived", () => {
      const nest = new Nest()
      nest.conceive()

      expect(() => nest.prepare(m => {})).toThrow(/conceive/g)
    })
  })

  describe(".conceive", () => {
    it("gets a scorpion", () => {
      const nest = new Nest()
      const scorpion = nest.conceive()

      expect(scorpion).toBeInstanceOf(Scorpion)
    })
  })
})
