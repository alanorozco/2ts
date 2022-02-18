function x(bar: Window): Type {
  return y(bar, "foo") as Type;
}

export function x(bar: Window): Type {
  return y(bar, "foo") as Type;
}
/**
 * @param {!x} bar
 * @return {!Type}
 */
const a = function x(bar) {
  return y(bar, "foo") as Type;
};

export const a = function x(bar) {
  return y(bar, "foo") as Type;
};
