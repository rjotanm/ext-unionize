import { UnionExtensions, UnionTypes } from "unionize";
export type UnionizedExternally<Record, TaggedRecord> = UnionTypes<Record, TaggedRecord> & Creators<Record, TaggedRecord> & UnionExtensions<Record, TaggedRecord>;
export type Creators<Record, TaggedRecord> = {
    [T in keyof Record]: {} extends Required<Record[T]> ? ((value?: {}) => TaggedRecord[keyof TaggedRecord]) : ((value: Record[T]) => TaggedRecord[keyof TaggedRecord]);
};
export type SingleValueVariants<Record extends ValueRec> = {
    T: {
        [T in keyof Record]: Record[T];
    };
};
export interface NoDefaultProp {
    default?: never;
}
export type ValueRec = NoDefaultRec<{} | {
    [tag: string]: any;
} | null>;
export type NoDefaultRec<Val> = {
    [k: string]: Val;
} & NoDefaultProp;
export declare function extUnionize<Record extends ValueRec>(record: Record): UnionizedExternally<Record, SingleValueVariants<Record>>;
export default extUnionize;
