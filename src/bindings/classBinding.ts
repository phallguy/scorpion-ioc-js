import Binding from "../binding"
import Hunt from "../hunt"

export default class ClassBinding extends Binding {
  public fetch(hunt: Hunt): any {
    return new this.contract(...hunt.args)
  }
}
