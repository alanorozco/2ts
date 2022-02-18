/**
 * @param {!Window} window
 * @return {!../my/type.MyType}
 */
const x = (window: Window): MyType => {
  return /** @type {!../my/type.MyType} */ y(window, "foo") as MyType;
};
