import {Casts, Predicates, UnionExtensions, UnionTypes} from "unionize";

export type UnionizedExternally<Record, TaggedRecord> = UnionTypes<
  Record,
  TaggedRecord
> &
  Creators<Record, TaggedRecord> &
  UnionExtensions<Record, TaggedRecord>;

export type Creators<Record, TaggedRecord> = {
  [T in keyof Record]: {} extends Required<Record[T]>
    ? ((value?: {}) => TaggedRecord[keyof TaggedRecord])
    : ((value: Record[T]) => TaggedRecord[keyof TaggedRecord])
};

export type SingleValueVariants<Record extends ValueRec> = {
  T: { [T in keyof Record]: Record[T] }
};

// Forbid usage of default property; reserved for pattern matching.
export interface NoDefaultProp {
  default?: never;
}

export type ValueRec = NoDefaultRec<{} | { [tag: string]: any } | null>;
export type NoDefaultRec<Val> = {
  [k: string]: Val;
} & NoDefaultProp;


export function extUnionize<
  Record extends ValueRec,
>(
  record: Record,
): UnionizedExternally<Record, SingleValueVariants<Record>>;

export function extUnionize<Record>(record: Record) {
  const creators = {} as Creators<Record, any>;
  for (const tag in record) {
    // @ts-ignore
    creators[tag] = ((value: any = {}): any => {
      return {[tag]: value} as any
    })
  }

  const is = {} as Predicates<any>;
  for (const tag in record) {
    is[tag] = ((variant: any) => tag in variant) as any;
  }

  function evalMatch(variant: any, cases: any, defaultCase = cases.default): any {
    const key = Object.keys(variant)[0];
    const handler = cases[key];
    const value = variant[key];
    return handler ? handler(value) : defaultCase(value);
  }

  const match = (first: any, second?: any) =>
    second ? evalMatch(first, second) : (variant: any) => evalMatch(variant, first);

  const identity = <A>(x: A) => x;
  const transform = (first: any, second?: any) =>
    second
      ? evalMatch(first, second, identity)
      : (variant: any) => evalMatch(variant, first, identity);

  const as = {} as Casts<Record, any>;
  for (const expectedTag in record) {
    as[expectedTag] = match({
      [expectedTag]: (x: any) => x,
      default: (val: any) => {
        throw new Error(`Attempted to cast ${val[expectedTag]} as ${expectedTag}`);
      },
    });
  }

  return Object.assign(
    {
      is,
      as,
      match,
      transform,
      _Record: record,
    },
    creators,
  );
}

export default extUnionize;
