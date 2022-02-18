/**
 * @param {!../my/path/foo.Foo} foo
 * @return {!../my/type.MyType}
 */
const x = (foo) => {
  return /** @type {!../my/type.MyType} */ (y(foo, 'foo'));
};
