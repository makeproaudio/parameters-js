import { Synapses } from './synapses';

/* As seen over here, the Parameter does not hold the Metadata or the Value. The Synapse is responsible for that
 */
export abstract class Parameter<T> {
  private _id: string;
  private _self: (callback: ParameterChangeEvent<T>) => void;
  private _listeners: ((callback: ParameterChangeEvent<T>) => void)[];
  constructor(initValue: T, id: string) {
    this._id = id;
    this._self = this._self_;
    this._listeners = [];
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
    const updatedValue = dest.update(newValue, forceListenerUpdate);
    this._listeners.forEach(l => {
      l({ value: updatedValue, parameter: this });
    });
    return updatedValue;
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

  bindFrom(other: Parameter<T>, callback: (parameterChangeEvent: ParameterChangeEvent<T>) => void) {
    try {
      const dest = Synapses.of(other);
      dest.add(this, callback);
      Synapses.set(this, dest);
    } catch (ex) {}
    /* set new value to incoming parameter immediately */
  }

  addListener(callback: (parameterChangeEvent: ParameterChangeEvent<T>) => void) {
    // const dest = Synapses.of(this);
    // dest.add(this, callback);
    this._listeners.push(callback);
  }

  removeListener(callback: (parameterChangeEvent: ParameterChangeEvent<T>) => void) {
    this._listeners.splice(this._listeners.indexOf(callback), 1);
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
