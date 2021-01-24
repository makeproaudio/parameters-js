import { Parameter } from '../base/Parameter';
import { Synapse } from './synapse';
import d from "debug";

const debug = d("parameters-js:synapses");

/* A simple registry mechanism used only internally to manage Synapses. */
class SynapsesManager {
  private _syanpses = new Map<string, Synapse>();
  private _id: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  constructor() {
    debug("Manager created with id", this._id);
  }

  of(param: Parameter<any>): Synapse {
    debug(this._id, ":finding synapse from", param.id, "which", !!this._syanpses.get(param.id) ? "exists" : "does not exist!");
    return this._syanpses.get(param.id)!;
  }

  create(param: Parameter<any>, initValue: any): Synapse {
    debug(this._id, ":created synapse for", param.id);
    const syn = new Synapse(param, initValue);
    this._syanpses.set(param.id, syn);
    return syn;
  }

  set(param: Parameter<any>, newSynapse: Synapse) {
    debug(this._id, ":setting new synapse for", param.id);
    this._syanpses.set(param.id, newSynapse);
  }
}

export let Synapses = new SynapsesManager();

export function setSynapsesManager(s: SynapsesManager): void {
  Synapses = s;
}

export function getSynapsesManager(): SynapsesManager {
  return Synapses;
}

