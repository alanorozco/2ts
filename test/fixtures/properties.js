export const Properties = {
  /**
   * @param {string} bar
   * @return {string}
   */
  foo: (bar) => bar,

  /**
   * @param {string} bar
   * @return {string}
   */
  bar: function (bar) {
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
