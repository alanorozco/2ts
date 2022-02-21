type Simple = Foo[];
type Nested = Bar[][];
type Interlaced = Promise<Baz[]>[];
type Deep = Set<Promise<Foo[]>[]>;
