import Scorpion from "./scorpion"

export interface Class {
  new (...args: any[]): any
}

export interface ClassWithCreate extends Class {
  create(scorpion: Scorpion): ClassWithCreate
}

export type Contract = Class // tslint:disable-line
