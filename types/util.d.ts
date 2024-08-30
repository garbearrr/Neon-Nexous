type ValueOf<T> = T[keyof T];

type PrependNextNum<A extends Array<unknown>> = A['size'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['size'] ? 0 : 1];

export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;

export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

type IfEquals<X, Y, A = X, B = never> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;

type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T];

type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

type Concrete<T> = {
    [P in keyof T]: T[P] extends Function ? never : T[P]
};

type ReturnTypeBasedOnKey<C, K extends keyof C> = C[K] extends (...args: any[]) => any ? ReturnType<C[K]> : C[K];

type PickMatching<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };

type ExtractMethods<T> = PickMatching<T, Function>;

type FieldKeys<C> = {
    [K in keyof C]: C[K] extends (...args: any[]) => any ? never : K
  }[keyof C];
  
// Using the FieldsOnly type to create a new type with only fields
type FilteredFields<T> = Pick<T, FieldKeys<T>>;