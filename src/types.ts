export interface Class {
  new (...args: any[]): any
}

export type Contract = Class | string // tslint:disable-line
