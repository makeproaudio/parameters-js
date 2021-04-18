import { KnownParameterMetadata, Parameters, ParameterType, ParameterValueChangeEvent } from "../src";

const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ [KnownParameterMetadata.TYPE]: ParameterType.NUMBER, [KnownParameterMetadata.MIN]: 100, [KnownParameterMetadata.MAX]: 200, [KnownParameterMetadata.STEP]: 1, value: 100 });

const l1 = (e: ParameterValueChangeEvent<any>) => {
  console.log(`l1 listener: ${e.value}`);
};

const l2 = (e: ParameterValueChangeEvent<any>) => {
  console.log(`l2 listener: ${e.value}`);
};

p1.addValueListener(l1);
p1.addValueListener(l2);

setInterval(() => p1.updateCyclic(), 1000);

setTimeout(() => {
  p1.removeValueListener(l1);
}, 5000);

setTimeout(() => {
  p1.addValueListener(l1);
}, 10000);
