export type MutableKeys<T> = {
  [K in keyof T]-?: (<U>() => U extends { [P in K]: T[P] } ? 1 : 2) extends
  (<U>() => U extends { -readonly [P in K]: T[P] } ? 1 : 2)
    ? K
    : never;
}[keyof T];
