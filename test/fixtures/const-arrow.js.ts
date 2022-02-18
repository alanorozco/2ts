/**
 * @param {!Window} bar
 * @return {!Type}
 */
const x = (window: Window): Type => {
  return /** @type {!Type} */ y(window, "foo") as Type;
};
/**
 * @param {!Window} bar
 * @return {!Type}
 */
export const x = (window: Window): Type => {
  return /** @type {!Type} */ y(window, "foo") as Type;
};
