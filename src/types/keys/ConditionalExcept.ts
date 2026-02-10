import type { ConditionalKeys } from "./ConditionalKeys";

export type ConditionalExcept<T, Condition> = Omit<T, ConditionalKeys<T, Condition>>;
