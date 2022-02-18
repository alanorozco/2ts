/**
 * @return {preact.VNode}
 */
export function Component() {
  return <div>{/** @type {string} */ (<Foo />)}</div>;
}
