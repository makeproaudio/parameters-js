import { Synapses } from '../synapses/synapses';
import { Synapse } from '../synapses/synapse';
import { ParameterValueChangeEvent, ParameterMetadataChangeEvent } from '../models/Events';
import { ParameterBlueprint } from '../models/ParameterBlueprint';
import { ParameterType } from '../models/ParameterType';
import { KnownParameterMetadata } from '../models/KnownParameterMetadata';

/* As seen over here, the Parameter does not hold the Metadata or the Value. The Synapse is responsible for that
 */
export abstract class Parameter<T> {
  private _id: string;
  private _selfValue: (callback: ParameterValueChangeEvent<T>) => void;
  private _selfRelativeValue: (callback: ParameterValueChangeEvent<T>) => void;
  private _selfMetadata: (callback: ParameterMetadataChangeEvent<T>) => void;
  private _default: Synapse;
  __valueListeners__: ((callback: ParameterValueChangeEvent<T>) => void)[];
  __relativeValueListeners__: ((callback: ParameterValueChangeEvent<T>) => void)[];
  __metadataListeners__: ((callback: ParameterMetadataChangeEvent<T>) => void)[];
  private _bound: boolean;

  constructor(initValue: T, id: string, valueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void, metadataChangeCallback?: (e: ParameterMetadataChangeEvent<any>) => void, relativeValueChangeCallback?: (e: ParameterValueChangeEvent<any>) => void) {
    this._id = id;
    this._selfValue = this._selfValue_;
    this._selfRelativeValue = this._selfRelativeValue_;
    this._selfMetadata = this._selfMetadata_;
    this.__valueListeners__ = [];
    this.__metadataListeners__ = [];
    this.__relativeValueListeners__ = [];
    this._default = Synapses.create(this, initValue);
    this._default.set(this, this._selfValue, this._selfMetadata, this._selfRelativeValue);
    this._bound = false;

    if (typeof valueChangeCallback == "function") {
      this.addValueListener(valueChangeCallback);
    }
    if (typeof relativeValueChangeCallback == "function") {
      this.addRelativeValueListener(relativeValueChangeCallback);
    }
    if (typeof metadataChangeCallback == "function") {
      this.addMetadataListener(metadataChangeCallback);
    }
  }

  get type(): ParameterType {
    return this.getMetadata(KnownParameterMetadata.TYPE);
  }

  __default__(): Synapse {
    return this._default;
  }

  get blueprint(): ParameterBlueprint {
    return {} as ParameterBlueprint;
  }

  private _selfValue_(callback: ParameterValueChangeEvent<T>) {
    // console.log(`${callback.parameter.id()} self: new value is ${callback.parameter.value}`);
  }

  private _selfMetadata_(callback: ParameterMetadataChangeEvent<T>) {
    // console.log(`${callback.parameter.id()} self: new value is ${callback.parameter.value}`);
  }

  private _selfRelativeValue_(callback: ParameterMetadataChangeEvent<T>) {
    // console.log(`${callback.parameter.id()} self: new relative value is ${callback.parameter.relativeValue}`);
  }

  get id(): string {
    return this._id;
  }

  get value(): T {
    return Synapses.of(this)._value;
  }

  set value(value: T) {
    this.doUpdate(value);
  }

  get relativeValue(): T {
    return Synapses.of(this)._relativeValue;
  }

  set relativeValue(value: T) {
    this.doRelativeUpdate(value);
  }

  private doUpdate(newValue: T, listenerUpdate: undefined | boolean = undefined): T {
    const dest = Synapses.of(this);
    const updatedValue = dest.update(this, newValue, listenerUpdate);
    return updatedValue;
  }

  private doRelativeUpdate(newValue: T): T {
    const dest = Synapses.of(this);
    const updatedValue = dest.updateRelative(newValue);
    return updatedValue;
  }

  get label(): string {
    return Synapses.of(this).getMetadata(KnownParameterMetadata.LABEL);
  }
  set label(label: string) {
    Synapses.of(this).setMetadata(KnownParameterMetadata.LABEL, label);
  }
  get context(): string {
    return Synapses.of(this).getMetadata(KnownParameterMetadata.CONTEXT);
  }
  set context(context: string) {
    Synapses.of(this).setMetadata(KnownParameterMetadata.CONTEXT, context);
  }
  get preferredUIWidget(): any {
    return Synapses.of(this).getMetadata(KnownParameterMetadata.PREFERRED_UI_WIDGET);
  }
  set preferredUIWidget(preferredUIWidget: any) {
    Synapses.of(this).setMetadata(KnownParameterMetadata.PREFERRED_UI_WIDGET, preferredUIWidget);
  }
  get color(): string {
    return Synapses.of(this).getMetadata(KnownParameterMetadata.COLOR);
  }
  set color(color: string) {
    Synapses.of(this).setMetadata(KnownParameterMetadata.COLOR, color);
  }
  get valueString(): string {
    return Synapses.of(this).getMetadata(KnownParameterMetadata.VALUE_STRING);
  }
  set valueString(valueString: string) {
    Synapses.of(this).setMetadata(KnownParameterMetadata.VALUE_STRING, valueString);
  }

  setMetadata(key: string, value: any, listenerUpdate: undefined | boolean = undefined) {
    const dest = Synapses.of(this);
    dest.setMetadata(key, value, listenerUpdate);
  }

  setMetadataSeveral(metadata: Record<string, any>, listenerUpdate: undefined | boolean = undefined) {
    const dest = Synapses.of(this);
    dest.setMetadataSeveral(metadata, listenerUpdate);
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

  update(newValue: T, listenerUpdate: undefined | boolean = undefined): T {
    return this.doUpdate(newValue, listenerUpdate);
  }

  updateRelative(newValue: T): T {
    return this.doRelativeUpdate(newValue);
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

  bindFrom(other: Parameter<T>, valueCallback?: (parameterChangeEvent: ParameterValueChangeEvent<T>) => void, metadataCallback?: (parameterChangeEvent: ParameterMetadataChangeEvent<T>) => void) {
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
    this.__valueListeners__.push(callback);
  }
  addRelativeValueListener(callback: (parameterChangeEvent: ParameterValueChangeEvent<T>) => void) {
    this.__relativeValueListeners__.push(callback);
  }
  addMetadataListener(callback: (parameterChangeEvent: ParameterMetadataChangeEvent<T>) => void) {
    this.__metadataListeners__.push(callback);
  }

  removeValueListener(callback: (parameterChangeEvent: ParameterValueChangeEvent<T>) => void) {
    this.__valueListeners__.splice(this.__valueListeners__.indexOf(callback), 1);
  }
  removeRelativeValueListener(callback: (parameterChangeEvent: ParameterValueChangeEvent<T>) => void) {
    this.__relativeValueListeners__.splice(this.__relativeValueListeners__.indexOf(callback), 1);
  }
  removeMetadataListener(callback: (parameterChangeEvent: ParameterMetadataChangeEvent<T>) => void) {
    this.__metadataListeners__.splice(this.__metadataListeners__.indexOf(callback), 1);
  }
}