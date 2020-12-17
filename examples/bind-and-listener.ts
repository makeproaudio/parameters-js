import { ParameterMetadataChangeEvent, Parameters, ParameterType, ParameterValueChangeEvent } from "../src";

const p1 = Parameters.newParameter('', 'p1');
p1.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 100 });

const l1 = (e: ParameterValueChangeEvent<any>) => {
  console.log(`l1 value listener: ${e.value}`);
};
const l1m = (e: ParameterMetadataChangeEvent<any>) => {
  console.log(`l1 metadata listener`, e.metadataUpdated);
};

p1.addValueListener(l1);
p1.addMetadataListener(l1m);

const p2 = Parameters.newParameter('', 'p2');
p2.updateType({ type: ParameterType.NUMBER, min: 100, max: 200, step: 1, value: 100 });

const l2 = (e: ParameterValueChangeEvent<any>) => {
  console.log(`l2 value listener: ${e.value}`);
};
const l2m = (e: ParameterMetadataChangeEvent<any>) => {
  console.log(`l2 metadata listener`, e.metadataUpdated);
};

p2.addValueListener(l2);
p2.addMetadataListener(l2m);
p2.unbind();

p1.bindFrom(p2);

// setInterval(() => p1.updateNext(1), 1000);
// setTimeout(() => p1.unbind(), 5000);

p2.unbind();
p1.unbind();
p1.updateNext(1);
p1.unbind();
p1.updateNext(1);
p1.bindFrom(p2);
