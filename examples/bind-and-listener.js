const { Parameters, ParameterType } = require('..');
const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 100 });

const l1 = e => {
  console.log(`l1 listener: ${e.value}`);
};

p1.addListener(l1);

const p2 = Parameters.newParameter('', 'p2');
p2.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 100 });

const l2 = e => {
  console.log(`l2 listener: ${e.value}`);
};

p2.addListener(l2);
p2.unbind();

p1.bindFrom(p2, () => {});

// setInterval(() => p1.updateNext(1), 1000);
// setTimeout(() => p1.unbind(), 5000);

p2.unbind();
p1.unbind();
p1.updateNext(1);
p1.unbind();
p1.updateNext(1);
p1.bindFrom(p2, () => {});
