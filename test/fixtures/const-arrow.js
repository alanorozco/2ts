/**
 * @param {!Window} bar
 * @return {!Type}
 */
const x = (window) => {
  return /** @type {!Type} */ (y(window, 'foo'));
};

/**
 * @param {!Window} bar
 * @return {!Type}
 */
export const x = (window) => {
  return /** @type {!Type} */ (y(window, 'foo'));
};
