import getHunt from "./getHunt"
import Hunt from "./hunt"
import { Inject } from "./injection/index"
import Scorpion from "./scorpion"

class Logger {}
class Animal {}
class Bear extends Animal {}
class Lion extends Animal {}
class Keeper {
  constructor(@Inject public readonly logger?: Logger) {}
}

class Zoo {
  @Inject
  public readonly cat?: Lion

  constructor(
    @Inject public readonly keeper: Keeper,
    @Inject public readonly animal: Animal,
    @Inject public readonly logger: Logger
  ) {}
}

describe("Hunt", () => {
  it("should be defined", () => {
    expect(Hunt).toBeDefined()
  })

  describe(".fetch", () => {
    let hunt: Hunt
    const scorpion = new Scorpion(map => {
      map.bind(Bear)
    })

    beforeEach(() => {
      hunt = new Hunt(scorpion)
    })

    it("gets an instance", () => {
      const animal = hunt.fetch(Animal)

      expect(animal).toBeInstanceOf(Bear)
    })

    it("assigns the hunt to the instance", () => {
      const lion = hunt.fetch(Lion)

      expect(getHunt(lion)).toBe(hunt)
    })

    it("assigns the scorpion to the instance", () => {
      const lion = hunt.fetch(Lion)

      expect(lion.scorpion).toBe(scorpion)
    })


    describe("constructor injection", () => {
      it("injects constructor arguments", () => {
        const zoo = hunt.fetch(Zoo)

        expect(zoo.keeper).toBeInstanceOf(Keeper)
      })

      it("accepts explicitly provided arguments", () => {
        const keeper = new Keeper()
        const zoo = hunt.fetch(Zoo, keeper)

        expect(zoo.keeper).toBe(keeper)
        expect(zoo.animal).toBeInstanceOf(Bear)
      })

      it("accepts explicitly provided null arguments", () => {
        const zoo = hunt.fetch(Zoo, null)

        expect(zoo.keeper).toBeNull()
        expect(zoo.animal).toBeInstanceOf(Bear)
      })
    })

    describe("property injection", () => {
      it("injects properties", () => {
        const zoo = hunt.fetch(Zoo)

        expect(zoo.cat).toBeInstanceOf(Lion)
      })
    })
  })
})
