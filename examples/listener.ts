import { Parameters, ParameterType, ParameterValueChangeEvent } from "../src";

const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 100 });

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
