import { Parameter } from '../base/Parameter';
import { v4 as uuid } from 'uuid';
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../Events';

type Callbacks = { value?: (parameterChangeEvent: ParameterValueChangeEvent<any>) => void, metadata?: (parameterChangeEvent: ParameterMetadataChangeEvent<any>) => void };
/* The Synapse should have the true value. Parameters bound to the same synapse should 'request' 
the synapse to make an update*/
export class Synapse {
  _value: any;

  /* */
  _uuid: string;
  private _metadata: Map<string, any>;
  private _bound: Map<Parameter<any>, Callbacks>;
  constructor(param: Parameter<any>, initValue: any) {
    this._bound = new Map<Parameter<any>, Callbacks>();
    this._value = initValue;
    this._metadata = new Map<string, any>();
    this._uuid = uuid();
  }

  lonely(): Parameter<any> | undefined {
    if (this._bound.size === 1) {
      const only = this._bound.keys().next().value;
      if (!(only.__default__()._uuid === this._uuid)) {
        return only;
      }
    }
    return undefined;
  }

  get(param: Parameter<any>): Callbacks | undefined {
    return this._bound.get(param);
  }

  set(param: Parameter<any>, valueCb?: (parameterChangeEvent: ParameterValueChangeEvent<any>) => void, metadataCb?: (parameterChangeEvent: ParameterMetadataChangeEvent<any>) => void) {
    let callback = this._bound.get(param);
    if (callback !== undefined) {
      throw `${param.id} already has callback attached in associated Synapse`;
    }
    this._bound.set(param, { value: valueCb, metadata: metadataCb });
  }

  unset(param: Parameter<any>) {
    let callback = this._bound.get(param);
    if (callback === undefined) {
      throw `${param.id} did not have a callback attached in associated Synapse`;
    }
    this._bound.delete(param);
  }

  update(value: any, forceListenerUpdate?: boolean): any {
    if (forceListenerUpdate !== true) if (value === this._value) return this._value;
    this._value = value;
    this._bound.forEach((callback, p) => {
      try {
        const boundCallback = callback.value?.bind(p);
        if (boundCallback) boundCallback({ value: this._value, parameter: p });
        p.__valueListeners__.forEach(l => {
          l.bind(this);
          l({ value: this._value, parameter: p });
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

  getAllMetadata(): Map<string, any> {
    return this._metadata;
  }

  setMetadata(key: string, value: any) {
    if (this._metadata.get(key) !== value) {
      this._metadata.set(key, value);
      this._bound.forEach((callback, p) => {
        const boundCallback = callback.metadata?.bind(p);
        if (boundCallback) boundCallback!({ metadataUpdated: { key, value }, parameter: p });
        p.__metadataListeners__.forEach(l => {
          l.bind(this);
          l!({ metadataUpdated: { key, value }, parameter: p });
        });
      });
    }
  }

  setMetadataSeveral(token: string, metadata: Record<string, any>, secretly?: boolean) {
    let changes = false;
    for (const [key, value] of Object.entries(metadata)) {
      if (this._metadata.get(key) !== value) {
        this._metadata.set(key, value);
        changes = true;
      }
    }
    if (!secretly && changes) {
      this._bound.forEach((callback, p) => {
        const boundCallback = callback.metadata?.bind(p);
        if (boundCallback) boundCallback!({ metadataUpdated: { key: token, value: true }, parameter: p });
        p.__metadataListeners__.forEach(l => {
          l.bind(this);
          l!({ metadataUpdated: { key: token, value: true }, parameter: p });
        });
      });
    }
  }

  removeMetadata(key: string) {
    this._metadata.delete(key);
    this._bound.forEach((callback, p) => {
      const boundCallback = callback.metadata?.bind(p);
      if (boundCallback) boundCallback!({ metadataRemoved: { key }, parameter: p });
      p.__metadataListeners__.forEach(l => {
        l.bind(this);
        l!({ metadataRemoved: { key }, parameter: p });
      });
    });
  }
}
