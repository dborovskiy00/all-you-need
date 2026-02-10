type CamelCaseInner<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Head}${Capitalize<CamelCaseInner<Tail>>}`
    : S extends `${infer Head}_${infer Tail}`
      ? `${Head}${Capitalize<CamelCaseInner<Tail>>}`
      : S;

export type CamelCase<S extends string> = CamelCaseInner<Lowercase<S>>;
