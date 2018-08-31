import Binding from "../binding"
import Hunt from "../hunt"
import { Contract } from "../types"

export default class CapturedBinding<T> extends Binding<T> {
  private instance: any

  constructor(contract: Contract<T>, private readonly binding: Binding<T>) {
    super(contract)
  }

  public fetch(hunt: Hunt): T {
    if (!this.instance) {
      this.instance = this.binding.fetch(hunt)
    }

    return this.instance
  }

  public isMatch(contract: Contract<any>): boolean {
    return this.binding.isMatch(contract)
  }

  public release(): void {
    this.instance = null
  }

  public replicate(): Binding<T> {
    const replicated = super.replicate()
    replicated.release()

    return replicated
  }
}
