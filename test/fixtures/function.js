/**
 * @param {!Window} bar
 * @return {!Type}
 */
function x(bar) {
  return /** @type {!Type} */ (y(bar, 'foo'));
}

/**
 * @param {!Window} bar
 * @return {!Type}
 */
export function x(bar) {
  return /** @type {!Type} */ (y(bar, 'foo'));
}

// TODO: JSDoc should be stripped out
/**
 * @param {!x} bar
 * @return {!Type}
 */
const a = function x(bar) {
  return /** @type {!Type} */ (y(bar, 'foo'));
};

/**
 * @param {!Window} bar
 * @return {!Type}
 */
export const a = function x(bar) {
  return /** @type {!Type} */ (y(bar, 'foo'));
};
