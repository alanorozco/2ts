export function Component(): preact.VNode {
  return <div>{(<Foo />) as string}</div>;
}
