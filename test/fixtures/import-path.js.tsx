import type { Foo } from "../my/path/foo";
import type { MyType } from "../my/type";

const x = (foo: Foo): MyType => {
  return y(foo, "foo") as MyType;
};
