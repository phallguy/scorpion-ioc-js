import Hunt, { HUNT_ANNOTATION_KEY } from "./hunt"
import { Inject } from "./injection/index"
import Scorpion from "./scorpion"

class Animal {}
class Bear extends Animal {}
class Lion extends Animal {}
class Keeper {}

class Zoo {
  constructor(@Inject public readonly keeper: Keeper, @Inject public readonly animal: Animal) {}
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

      expect(lion[HUNT_ANNOTATION_KEY]).toBe(hunt)
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

      it("detects circular dependencies", () => {
        class ZooKeeper extends Keeper {
          constructor(@Inject theZoo: Zoo) {
            super()
          }
        }

        const childScorpion = scorpion.replicate()
        childScorpion.prepare(map => {
          map.bind(ZooKeeper)
        })
        const childHunt = new Hunt(childScorpion)
        expect(() => {
          childHunt.fetch(Zoo)
        }).toThrow(/Circular/)
      })

      xit("reuses a parent object for a child in the same hunt", () => {})
      xit("reuses an instance already resolved in a parent in the same hunt", () => {})
      xit("gets a new instance for a sibling", () => {})
    })

    describe("property injection", () => {})
  })
})
