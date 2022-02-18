/**
 * @param {!Window} bar
 * @return {!Type}
 */
function x(bar: Window): Type {
  return /** @type {!Type} */ y(bar, "foo") as Type;
}
/**
 * @param {!Window} bar
 * @return {!Type}
 */
export function x(bar: Window): Type {
  return /** @type {!Type} */ y(bar, "foo") as Type;
}
/**
 * @param {!Window} bar
 * @return {!Type}
 */
const a = function x(bar) {
  return /** @type {!Type} */ y(bar, "foo") as Type;
};
/**
 * @param {!Window} bar
 * @return {!Type}
 */
export const a = function x(bar) {
  return /** @type {!Type} */ y(bar, "foo") as Type;
};
