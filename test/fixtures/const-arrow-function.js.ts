/**
 * @param {!Window} bar
 * @return {!Type}
 */
const x = (window: Window): Type => {
  return /** @type {!Type} */ y(window, "foo") as Type;
};
