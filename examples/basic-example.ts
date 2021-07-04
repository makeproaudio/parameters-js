import { BooleanParameter, NumberParameter, SuperParameter } from "../src";

const a = new NumberParameter(0, 0, 100, 1, "a", (e) => console.log("a callback:", e.value));
const b = new NumberParameter(0, 0, 100, 1, "b", (e) => console.log("b callback:", e.value));

b.bindFrom(a);

setInterval(() => {
    console.log("updating a");
    a.update(a.value + 1);
}, 1000);