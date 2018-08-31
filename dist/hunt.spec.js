var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import Hunt, { HUNT_ANNOTATION_KEY } from "./hunt";
import { Inject } from "./injection/index";
import Scorpion from "./scorpion";
class Animal {
}
class Bear extends Animal {
}
class Lion extends Animal {
}
class Keeper {
}
let Zoo = class Zoo {
    constructor(keeper, animal) {
        this.keeper = keeper;
        this.animal = animal;
    }
};
Zoo = __decorate([
    __param(0, Inject), __param(1, Inject),
    __metadata("design:paramtypes", [Keeper, Animal])
], Zoo);
describe("Hunt", () => {
    it("should be defined", () => {
        expect(Hunt).toBeDefined();
    });
    describe(".fetch", () => {
        let hunt;
        const scorpion = new Scorpion(map => {
            map.bind(Bear);
        });
        beforeEach(() => {
            hunt = new Hunt(scorpion);
        });
        it("gets an instance", () => {
            const animal = hunt.fetch(Animal);
            expect(animal).toBeInstanceOf(Bear);
        });
        it("assigns the hunt to the instance", () => {
            const lion = hunt.fetch(Lion);
            expect(lion[HUNT_ANNOTATION_KEY]).toBe(hunt);
        });
        describe("constructor injection", () => {
            it("injects constructor arguments", () => {
                const zoo = hunt.fetch(Zoo);
                expect(zoo.keeper).toBeInstanceOf(Keeper);
            });
            it("accepts explicitly provided arguments", () => {
                const keeper = new Keeper();
                const zoo = hunt.fetch(Zoo, keeper);
                expect(zoo.keeper).toBe(keeper);
                expect(zoo.animal).toBeInstanceOf(Bear);
            });
            it("detects circular dependencies", () => {
                let ZooKeeper = class ZooKeeper extends Keeper {
                    constructor(theZoo) {
                        super();
                    }
                };
                ZooKeeper = __decorate([
                    __param(0, Inject),
                    __metadata("design:paramtypes", [Zoo])
                ], ZooKeeper);
                const childScorpion = scorpion.replicate();
                childScorpion.prepare(map => {
                    map.bind(ZooKeeper);
                });
                const childHunt = new Hunt(childScorpion);
                expect(() => {
                    childHunt.fetch(Zoo);
                }).toThrow(/Circular/);
            });
            xit("reuses a parent object for a child in the same hunt", () => { });
            xit("reuses an instance already resolved in a parent in the same hunt", () => { });
            xit("gets a new instance for a sibling", () => { });
        });
        describe("property injection", () => { });
    });
});
