export const Properties = {
  foo: (bar: string): string => bar,

  bar: function (bar: string): string {
    return bar;
  },

  baz(bar: string): string {
    return bar;
  },
};
