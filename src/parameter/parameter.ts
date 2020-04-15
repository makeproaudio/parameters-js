import { Synapses } from './synapses';

export abstract class Parameter<T> {
  private _id: string;
  private _self: (callback: ParameterChangeEvent<T>) => void;
  constructor(initValue: T, id: string) {
    this._id = id;
    this._self = this._self_;
    Synapses.create(this, initValue).add(this, this._self);
  }

  private _self_(callback: ParameterChangeEvent<T>) {
    // console.log(this._id);
    // console.log(`${param._id} self: new value is ${newValue}`);
  }

  id(): string {
    return this._id;
  }

  value(): T {
    return Synapses.of(this)._value;
  }

  private doUpdate(newValue: T, forceListenerUpdate?: boolean): T {
    const dest = Synapses.of(this);
    return dest.update(newValue, forceListenerUpdate);
  }

  setMetadata(key: string, value: any) {
    const dest = Synapses.of(this);
    dest.setMetadata(key, value);
  }

  setMetadataSeveral(token: string, key: string[], value: any[]) {
    const dest = Synapses.of(this);
    dest.setMetadataSeveral(token, key, value);
  }

  removeMetadata(key: string) {
    const dest = Synapses.of(this);
    dest.removeMetadata(key);
  }

  getMetadata(key: string) {
    const dest = Synapses.of(this);
    return dest.getMetadata(key);
  }

  update(newValue: T, forceListenerUpdate?: boolean): T {
    return this.doUpdate(newValue, forceListenerUpdate);
  }

  bindFrom(parameter: Parameter<T>, callback: (parameterChangeEvent: ParameterChangeEvent<T>) => void) {
    try {
      const dest = Synapses.of(parameter);
      Synapses.set(this, dest);
      dest.add(this, callback);
    } catch (ex) {}
    /* set new value to incoming parameter immediately */
  }

  addListener(callback: (parameterChangeEvent: ParameterChangeEvent<T>) => void) {
    const dest = Synapses.of(this);
    dest.add(this, callback);
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
