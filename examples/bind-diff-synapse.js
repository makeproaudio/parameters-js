const { Parameters, ParameterType } = require('..');
const p1 = Parameters.newParameter('user', 'p1');
p1.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 100 });

const p2 = Parameters.newParameter('user', 'p2');
p2.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 150 });

p2.bindFrom(p1, e => {
  console.log(`p2->p1: ${e.value}`);
});

const p5 = Parameters.newParameter('user', 'p5');
p5.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 150 });

p5.bindFrom(p1, e => {
  console.log(`p5->p1: ${e.value}`);
});

const p3 = Parameters.newParameter('user', 'p3');
p3.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 150 });

const p4 = Parameters.newParameter('user', 'p4');
p4.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 150 });

p4.bindFrom(p3, e => {
  console.log(`p4->p3: ${e.value}`);
});

setInterval(() => p1.updateCyclic(), 1000);
setInterval(() => p3.updateCyclic(), 1000);

/* Unbinding p1 will leave p2 as the only Parameter in the Synapse, therefore p2 will also be unbound automatically*/
p1.unbind();

p2.bindFrom(p3, e => {
  console.log(`p2->p3: ${e.value}`);
});
