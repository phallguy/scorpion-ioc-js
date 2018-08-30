import Scorpion from "./scorpion"
import Hunt from "./hunt"

class Example {}

describe("container", () => {
  it("is defined", () => {
    expect(Scorpion).toBeDefined()
  })

  describe(".fetch", () => {
    it("should execute a hunt", () => {
      const scorpion = new Scorpion()
      scorpion.execute = jest.fn()

      scorpion.fetch(Example)

      expect(scorpion.execute).toBeCalledWith(expect.any(Hunt))
    })
  })
})
