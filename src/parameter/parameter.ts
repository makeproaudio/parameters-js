import { Synapses } from './synapses';
import { Synapse } from './synapse';

/* As seen over here, the Parameter does not hold the Metadata or the Value. The Synapse is responsible for that
 */
export abstract class Parameter<T> {
  private _id: string;
  private _self: (callback: ParameterChangeEvent<T>) => void;
  private _default: Synapse;
  __listeners__: ((callback: ParameterChangeEvent<T>) => void)[];
  private _bound: boolean;

  constructor(initValue: T, id: string) {
    this._id = id;
    this._self = this._self_;
    this.__listeners__ = [];
    this._default = Synapses.create(this, initValue);
    this._default.set(this, this._self);
    this._bound = false;
  }

  __default__(): Synapse {
    return this._default;
  }

  private _self_(callback: ParameterChangeEvent<T>) {
    // console.log(`${callback.parameter.id()} self: new value is ${callback.parameter.value}`);
  }

  get id(): string {
    return this._id;
  }

  get value(): T {
    return Synapses.of(this)._value;
  }

  private doUpdate(newValue: T, forceListenerUpdate?: boolean): T {
    const dest = Synapses.of(this);
    const updatedValue = dest.update(newValue, forceListenerUpdate);
    return updatedValue;
  }

  setMetadata(key: string, value: any) {
    const dest = Synapses.of(this);
    dest.setMetadata(key, value);
  }

  setMetadataSeveral(token: string, key: string[], value: any[], secretly?: boolean) {
    const dest = Synapses.of(this);
    dest.setMetadataSeveral(token, key, value, secretly);
  }

  removeMetadata(key: string) {
    const dest = Synapses.of(this);
    dest.removeMetadata(key);
  }

  getMetadata(key: string) {
    const dest = Synapses.of(this);
    return dest.getMetadata(key);
  }

  getAllMetadata(): Map<string, any> {
    const dest = Synapses.of(this);
    return dest.getAllMetadata();
  }

  update(newValue: T, forceListenerUpdate?: boolean): T {
    return this.doUpdate(newValue, forceListenerUpdate);
  }

  get bound(): boolean {
    return this._bound;
  }

  __acquire__(): void {
    this._bound = true;
  }

  __release__(): void {
    this._bound = false;
  }

  bindFrom(other: Parameter<T>, callback: (parameterChangeEvent: ParameterChangeEvent<T>) => void) {
    if (!this.bound) {
      try {
        const dest = Synapses.of(other);
        dest.set(this, callback);
        Synapses.set(this, dest);
        this.__acquire__();
        other.__acquire__();
      } catch (ex) {
        console.log(ex);
      }
    } else {
      console.log(`${this.id} is already bound to another Synapse`);
    }
    /* set new value to incoming parameter immediately */
  }

  unbind() {
    try {
      if (!this.bound) return;
      const me: Synapse = Synapses.of(this);
      me.unset(this);
      Synapses.set(this, this._default);
      this.__release__();
      const lonely = me.lonely();
      if (lonely) {
        lonely.unbind();
      }
      if (this._default.get(this) !== this._self) this._default.set(this, this._self);
    } catch (ex) {
      console.log(ex);
    }
  }

  addListener(callback: (parameterChangeEvent: ParameterChangeEvent<T>) => void) {
    // const dest = Synapses.of(this);
    // dest.add(this, callback);
    this.__listeners__.push(callback);
  }

  removeListener(callback: (parameterChangeEvent: ParameterChangeEvent<T>) => void) {
    this.__listeners__.splice(this.__listeners__.indexOf(callback), 1);
  }
}

export interface ParameterChangeEvent<T> {
  parameter: Parameter<T>;
  value?: T;
  metadataUpdated?: {
    key: string;
    value: any;
  };
  metadataRemoved?: {
    key: string;
  };
}
