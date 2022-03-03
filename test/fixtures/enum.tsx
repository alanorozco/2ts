const Foo = {
  foo: "bar",
};
type Foo_Enum = typeof Foo[keyof typeof Foo];
const Bar = {
  x: 1,
  y: 2,
};
type Bar_Enum = typeof Bar[keyof typeof Bar];
