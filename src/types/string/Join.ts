export type Join<T extends readonly string[], D extends string> =
  T extends readonly []
    ? ""
    : T extends readonly [infer Head extends string]
      ? Head
      : T extends readonly [infer Head extends string, ...infer Tail extends string[]]
        ? `${Head}${D}${Join<Tail, D>}`
        : string;
