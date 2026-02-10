export type RequiredDeep<T> = T extends object
  ? { [P in keyof T]-?: RequiredDeep<T[P]> }
  : T;
