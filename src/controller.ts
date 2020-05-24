import { ReduxRegister } from ".";

type ModelConstructor<T> = new () => T;

export class Controller {
  protected register: ReduxRegister;

  constructor(register: ReduxRegister) {
    this.register = register;

    if (!(this.constructor as any).instances) {
      (this.constructor as any).instances = new WeakMap();
    }

    (this.constructor as any).instances.set(register, this);
  }

  public static getInstance<T extends Controller>(this: ModelConstructor<T> & typeof Controller, register: ReduxRegister): T {
    if (!(this as any).instances) {
      (this as any).instances = new WeakMap();
    }

    let instance = (this as any).instances.get(register);
    if (!instance) {
      instance = new this(register);
    }

    return instance;
  }
}
