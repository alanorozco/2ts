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

  /**
   * @param {string} bar
   * @return {string}
   */
  baz(bar) {
    return bar;
  },
};
