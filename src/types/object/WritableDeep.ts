export type WritableDeep<T> = T extends object
  ? { -readonly [P in keyof T]: WritableDeep<T[P]> }
  : T;
