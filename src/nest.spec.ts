import Nest from "./nest"
import Scorpion from "./scorpion"

describe("Nest", () => {
  describe(".prepare", () => {
    it("fails if already conceived", async () => {
      const nest = new Nest()
      await nest.conceive()

      expect(() => nest.prepare(m => {})).toThrow(/conceive/g)
    })
  })

  describe(".conceive", () => {
    it("gets a scorpion", async () => {
      const nest = new Nest()
      const scorpion = await nest.conceive()

      expect(scorpion).toBeInstanceOf(Scorpion)
    })
  })
})
