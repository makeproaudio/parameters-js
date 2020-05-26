import { Parameter, ParameterChangeEvent } from './parameter';

/* The Synapse should have the true value. Parameters bound to the same synapse should 'request' 
the synapse to make an update*/
export class Synapse {
  _value: any;


  /* */
  private _metadata: Map<string, any>;
  private _bound: Map<Parameter<any>, ((parameterChangeEvent: ParameterChangeEvent<any>) => void)[]>;
  constructor(param: Parameter<any>, initValue: any) {
    this._bound = new Map<Parameter<any>, ((parameterChangeEvent: ParameterChangeEvent<any>) => void)[]>();
    this._value = initValue;
    this._metadata = new Map<string, any>();
  }

  add(param: Parameter<any>, callback: (parameterChangeEvent: ParameterChangeEvent<any>) => void) {
    let callbacks = this._bound.get(param);
    if (callbacks === undefined) {
      callbacks = new Array<() => void>();
    }
    callbacks.push(callback);
    this._bound.set(param, callbacks);
  }

  update(value: any, forceListenerUpdate?: boolean): any {
    if (forceListenerUpdate !== true) if (value === this._value) return this._value;
    this._value = value;
    this._bound.forEach((callbacks, p) => {
      try {
        callbacks.forEach(callback => {
          const boundCallback = callback.bind(p);
          boundCallback!({ value: this._value, parameter: p });
        });
      } catch (ex) {
        console.log(ex);
      }
    });
    return this._value;
  }

  getMetadata(key: string): any {
    return this._metadata.get(key);
  }

  setMetadata(key: string, value: any) {
    this._metadata.set(key, value);
    this._bound.forEach((callbacks, p) => {
      callbacks.forEach(callback => {
        const boundCallback = callback.bind(p);
        boundCallback!({ metadataUpdated: { key, value }, parameter: p });
      });
    });
  }

  setMetadataSeveral(token: string, keys: string[], values: any[]) {
    if (keys.length != values.length) throw Error('while updating several metadata, length of keys and values array should be the same');
    for (let i = 0; i < keys.length; i++) {
      this._metadata.set(keys[i], values[i]);
    }
    this._bound.forEach((callbacks, p) => {
      callbacks.forEach(callback => {
        const boundCallback = callback.bind(p);
        boundCallback!({ metadataUpdated: { key: token, value: true }, parameter: p });
      });
    });
  }

  removeMetadata(key: string) {
    this._metadata.delete(key);
    this._bound.forEach((callbacks, p) => {
      callbacks.forEach(callback => {
        const boundCallback = callback.bind(p);
        boundCallback!({ metadataRemoved: { key }, parameter: p });
      });
    });
  }
}
