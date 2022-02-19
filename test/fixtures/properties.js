export const Properties = {
  // BUG: Comment should be stripped out
  /**
   * @param {string} bar
   * @return {string}
   */
  foo: (bar) => bar,

  // BUG: Comment should be stripped out
  /**
   * @param {string} bar
   * @return {string}
   */
  foo: function (bar) {
    return bar;
  },

  // BUG: Type annotations are ignored
  // BUG: Comment should be stripped out
  /**
   * @param {string} bar
   * @return {string}
   */
  foo(bar) {
    return bar;
  },
};
