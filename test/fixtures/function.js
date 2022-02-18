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
