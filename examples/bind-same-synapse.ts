import { Parameters, ParameterType } from "../src";

const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 100 });

const p2 = Parameters.newParameter('', 'p2');
p2.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 150 });

p2.bindFrom(p1, e => {
  console.log(`p2->p1: ${e.value}`);
});

const p3 = Parameters.newParameter('', 'p3');
p3.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 150 });

p3.bindFrom(p2, e => {
  console.log(`p3->p2: ${e.value}`);
});

/* Should fail */
p3.bindFrom(p2, e => {
  console.log(`Another p3->p2: ${e.value}`);
});

/* Should fail */
p2.bindFrom(p3, e => {
  console.log(`Cyclic p3->p2: ${e.value}`);
});

setInterval(() => p3.updateCyclic(), 1000);
setTimeout(() => p3.unbind(), 5000);
