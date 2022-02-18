/**
 * @param {!Window} window
 * @return {!../my/type.MyType}
 */
const x = (window) => {
  return /** @type {!../my/type.MyType} */ (y(window, "foo"));
};
