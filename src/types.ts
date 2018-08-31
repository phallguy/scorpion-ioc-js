import Hunt from "./hunt"

export interface Class {
  new (...args: any[]): any
}

export interface ClassWithCreate extends Class {
  create(hunt: Hunt): ClassWithCreate
}

export type Contract = Class // tslint:disable-line
