export const Properties = {
  foo: (bar: string): string => bar,

  bar: function (bar: string): string {
    return bar;
  },
  // BUG: Type annotations are ignored
  // BUG: Comment should be stripped out
  /**
   * @param {string} bar
   * @return {string}
   */
  baz(bar) {
    return bar;
  },
};
