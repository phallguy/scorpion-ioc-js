import Scorpion from "./scorpion"
import { Contract } from "./types"

export default class Hunt {
  constructor(private scorpion: Scorpion, private contract: Contract, private args: any[]) {}
}
