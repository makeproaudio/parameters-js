import { NumberParameter } from "../src";

const a = new NumberParameter(0, 0, 100, 1, "a", (e) => console.log("a callback:", e.value));
const b = new NumberParameter(0, 0, 100, 1, "b", (e) => console.log("b callback:", e.value));

// a.addValueListener((v) => console.log("a was updated!!!"), true)

b.bindFrom(a);

setInterval(() => {
    console.log("updating a");
    a.update(a.value + 1);
}, 1000);