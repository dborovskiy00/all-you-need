import type { ConditionalKeys } from "./ConditionalKeys";

export type ConditionalPick<T, Condition> = Pick<T, ConditionalKeys<T, Condition>>;
