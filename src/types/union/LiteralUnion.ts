export type LiteralUnion<
  LiteralType,
  BaseType extends string | number | bigint | boolean = string,
> = LiteralType | (BaseType & Record<never, never>);
