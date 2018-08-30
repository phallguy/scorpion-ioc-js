import Binding from "../binding"
import Hunt from "../hunt"
import { Contract } from "../types"

export default class CapturedBinding extends Binding {
  private instance: any

  constructor(contract: Contract, private readonly binding: Binding) {
    super(contract)
  }

  public fetch(hunt: Hunt): any {
    if (!this.instance) {
      this.instance = this.binding.fetch(hunt)
    }

    return this.instance
  }

  public isMatch(contract: Contract): boolean {
    return this.binding.isMatch(contract)
  }

  public release(): void {
    this.instance = null
  }

  public replicate(): Binding {
    const replicated = super.replicate()
    replicated.release()

    return replicated
  }
}
