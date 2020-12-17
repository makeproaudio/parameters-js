import { Synapses } from './synapses';
import { Synapse } from './synapse';

/* As seen over here, the Parameter does not hold the Metadata or the Value. The Synapse is responsible for that
 */
export abstract class Parameter<T> {
  private _id: string;
  private _selfValue: (callback: ParameterValueChangeEvent<T>) => void;
  private _selfMetadata: (callback: ParameterMetadataChangeEvent<T>) => void;
  private _default: Synapse;
  __valueListeners__: ((callback: ParameterValueChangeEvent<T>) => void)[];
  __metadataListeners__: ((callback: ParameterMetadataChangeEvent<T>) => void)[];
  private _bound: boolean;

  constructor(initValue: T, id: string) {
    this._id = id;
    this._selfValue = this._selfValue_;
    this._selfMetadata = this._selfMetadata_;
    this.__valueListeners__ = [];
    this.__metadataListeners__ = [];
    this._default = Synapses.create(this, initValue);
    this._default.set(this, this._selfValue, this._selfMetadata);
    this._bound = false;
  }

  __default__(): Synapse {
    return this._default;
  }

  private _selfValue_(callback: ParameterValueChangeEvent<T>) {
    // console.log(`${callback.parameter.id()} self: new value is ${callback.parameter.value}`);
  }

  private _selfMetadata_(callback: ParameterMetadataChangeEvent<T>) {
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

  bindFrom(other: Parameter<T>, valueCallback: (parameterChangeEvent: ParameterValueChangeEvent<T>) => void, metadataCallback: (parameterChangeEvent: ParameterMetadataChangeEvent<T>) => void) {
    if (!this.bound) {
      try {
        const dest = Synapses.of(other);
        dest.set(this, valueCallback, metadataCallback);
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
      if (this._default.get(this)?.value !== this._selfValue || this._default.get(this)?.metadata !== this._selfMetadata) {
        this._default.set(this, this._selfValue, this._selfMetadata)
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  addValueListener(callback: (parameterChangeEvent: ParameterValueChangeEvent<T>) => void) {
    // const dest = Synapses.of(this);
    // dest.add(this, callback);
    this.__valueListeners__.push(callback);
  }
  addMetadataListener(callback: (parameterChangeEvent: ParameterMetadataChangeEvent<T>) => void) {
    // const dest = Synapses.of(this);
    // dest.add(this, callback);
    this.__metadataListeners__.push(callback);
  }

  removeValueListener(callback: (parameterChangeEvent: ParameterValueChangeEvent<T>) => void) {
    this.__valueListeners__.splice(this.__valueListeners__.indexOf(callback), 1);
  }
  removeMetadataListener(callback: (parameterChangeEvent: ParameterMetadataChangeEvent<T>) => void) {
    this.__metadataListeners__.splice(this.__metadataListeners__.indexOf(callback), 1);
  }
}

export interface ParameterValueChangeEvent<T> {
  parameter: Parameter<T>;
  value: T;
}

export interface ParameterMetadataChangeEvent<T> {
  parameter: Parameter<T>;
  metadataUpdated?: {
    key: string;
    value: any;
  };
  metadataRemoved?: {
    key: string;
  };
}