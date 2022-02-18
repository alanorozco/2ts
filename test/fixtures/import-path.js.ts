import type { Foo } from "../my/path/foo";
import type { MyType } from "../my/type";
/**
 * @param {!../my/path/foo.Foo} foo
 * @return {!../my/type.MyType}
 */
const x = (foo: Foo): MyType => {
  return /** @type {!../my/type.MyType} */ y(foo, "foo") as MyType;
};
