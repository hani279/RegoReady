const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

export const money = (n: number) => aud.format(n);
export const dollars = (n: number) =>
  aud.format(n).replace(/\.00$/, "");
