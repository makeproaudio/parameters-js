import * as Parameters from './parameter/parameters';

import {
  SuperParameter,
  SuperParameterType,
  SuperParameterTypeChangeRequestToken,
  SuperParameterBlueprint,
  BindFromRequestToken,
  BooleanParameter,
  NumberParameter,
  StringArrayParameter,
  StringParameter,
  ArrayParameter,
  IntegerArrayParameter
} from './parameter/parameter-types';

import { ParameterValueChangeEvent, ParameterMetadataChangeEvent, Parameter } from './parameter/parameter';
import { getSynapsesManager, setSynapsesManager } from './parameter/synapses';

export { Parameters };
export { Parameter, SuperParameter, BooleanParameter, NumberParameter, StringParameter, StringArrayParameter, IntegerArrayParameter, ArrayParameter };
export { SuperParameterType, SuperParameterTypeChangeRequestToken, SuperParameterBlueprint, BindFromRequestToken };
export { ParameterValueChangeEvent, ParameterMetadataChangeEvent };
export { getSynapsesManager, setSynapsesManager };
