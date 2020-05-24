import { ReduxRegister } from ".";

type ModelConstructor<T> = new () => T;

export class Controller {
  constructor(register: ReduxRegister) {
    if (!(this.constructor as any).instances) {
      (this.constructor as any).instances = new WeakMap();
    }
    (this.constructor as any).instances.set(register, this);
  }

  public static getInstance<T extends Controller>(this: ModelConstructor<T> & typeof Controller, register: ReduxRegister): T {
    return (this as any).instances.get(register);
  }
}
