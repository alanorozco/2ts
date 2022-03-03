# Test Suite

To generate, run:

```console
npm run test:update
```

---

## array-generic

### javascript

```jsx
/** @typedef {Array<Foo>} */
let Simple;

/** @typedef {Array<Array<Bar>>} */
let Nested;

/** @typedef {Array<Promise<Array<Baz>>>} */
let Interlaced;

/** @typedef {Set<Array<Promise<Array<Foo>>>>} */
let Deep;
```

### typescript

```tsx
type Simple = Foo[];
type Nested = Bar[][];
type Interlaced = Promise<Baz[]>[];
type Deep = Set<Promise<Foo[]>[]>;
```

## arrow

### javascript

```jsx
/**
 * @param {!Window} bar
 * @return {!Type}
 */
const x = (window) => {
  return /** @type {!Type} */ (y(window, "foo"));
};

/**
 * @param {!Window} bar
 * @return {!Type}
 */
export const x = (window) => {
  return /** @type {!Type} */ (y(window, "foo"));
};
```

### typescript

```tsx
const x = (window: Window): Type => {
  return y(window, "foo") as Type;
};

export const x = (window: Window): Type => {
  return y(window, "foo") as Type;
};
```

## declaration

### javascript

```jsx
/**
 * @type {Array<{a: string, b: number}>}
 */
const a = [];
```

### typescript

```tsx
const a: { a: string; b: number }[] = [];
```

## empty-type

### javascript

```jsx
/** @type */
let foo;

/**
 * @param a
 * @return
 */
function b(a) {
  return a;
}
```

### typescript

```tsx
let foo;

function b(a) {
  return a;
}
```

## enum

### javascript

```jsx
/** @enum */
const Foo_Enum = {
  foo: "bar",
};

/** @enum */
const Bar_Enum = {
  x: 1,
  y: 2,
};
```

### typescript

```tsx
const Foo = {
  foo: "bar",
};
type Foo_Enum = typeof Foo[keyof typeof Foo];
const Bar = {
  x: 1,
  y: 2,
};
type Bar_Enum = typeof Bar[keyof typeof Bar];
```

## function

### javascript

```jsx
/**
 * Description is preserved :)
 * @param {!Window} bar
 * @return {!Type}
 */
function x(bar) {
  return /** @type {!Type} */ (y(bar, "foo"));
}

/**
 * @param {!Window} bar
 * @return {!Type}
 */
export function x(bar) {
  return /** @type {!Type} */ (y(bar, "foo"));
}

/**
 * @param {!Element=} optional
 * @return {!Type}
 */
const a = function x(optional) {
  return /** @type {!Type} */ (optional);
};

/**
 * @param {!Window} bar
 * @return {!Type}
 */
export const a = function x(bar) {
  return /** @type {!Type} */ (y(bar, "foo"));
};
```

### typescript

```tsx
/**
 * Description is preserved :)
 */
function x(bar: Window): Type {
  return y(bar, "foo") as Type;
}

export function x(bar: Window): Type {
  return y(bar, "foo") as Type;
}

const a = function x(optional?: Element): Type {
  return optional as Type;
};

export const a = function x(bar: Window): Type {
  return y(bar, "foo") as Type;
};
```

## import-multiple

### javascript

```jsx
/** @typedef {./foo.A|./foo.B} */
let AorB;
```

### typescript

```tsx
import type { A, B } from "./foo";
type AorB = A | B;
```

## import-path

### javascript

```jsx
/**
 * @param {!../my/path/foo.Foo} foo
 * @return {!../my/type.MyType}
 */
const x = (foo) => {
  return /** @type {!../my/type.MyType} */ (y(foo, "foo"));
};
```

### typescript

```tsx
import type { Foo } from "../my/path/foo";
import type { MyType } from "../my/type";

const x = (foo: Foo): MyType => {
  return y(foo, "foo") as MyType;
};
```

## jsx

### javascript

```jsx
/**
 * @return {preact.VNode}
 */
export function Component() {
  return <div>{/** @type {string} */ (<Foo />)}</div>;
}
```

### typescript

```tsx
export function Component(): preact.VNode {
  return <div>{(<Foo />) as string}</div>;
}
```

## optional-param

### javascript

```jsx
/**
 * @param {boolean=} optional
 */
function a(optional) {
  return optional;
}

/**
 * @param {boolean=} optional
 */
function b(optional = false) {
  return optional;
}
```

### typescript

```tsx
function a(optional?: boolean) {
  return optional;
}

function b(optional: boolean = false) {
  return optional;
}
```

## properties

### javascript

```jsx
export const Properties = {
  /**
   * @param {string} bar
   * @return {string}
   */
  foo: (bar) => bar,

  /**
   * @param {string} bar
   * @return {string}
   */
  bar: function (bar) {
    return bar;
  },

  /**
   * @param {string} bar
   * @return {string}
   */
  baz(bar) {
    return bar;
  },
};
```

### typescript

```tsx
export const Properties = {
  foo: (bar: string): string => bar,

  bar: function (bar: string): string {
    return bar;
  },

  baz(bar: string): string {
    return bar;
  },
};
```

## star

### javascript

```jsx
/**
 * @param {*} value
 * @return {*}
 */
function identity(value) {
  return value;
}
```

### typescript

```tsx
function identity(value: any): any {
  return value;
}
```

## typedef

### javascript

```jsx
/**
 * @typedef {{
 *   foo: 'foo',
 *   bar?: Whatever
 * }}
 */
export let MyStruct;

/**
 * Description
 * @typedef {?string|null|MyTypeAlias[]}
 */
export let MyTypeAlias;
```

### typescript

```tsx
export type MyStruct = { foo: "foo"; bar?: Whatever };
/**
 * Description
 */
export type MyTypeAlias = null | string | null | MyTypeAlias[];
```
