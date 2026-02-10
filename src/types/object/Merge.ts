export type Merge<T, S> = Omit<T, keyof S> & S;
