declare interface String {
    fromTuple(): number[];
    deserialize<T>(): T;
}

declare interface Array<T> {
    toTuple(): string;
    serialize(): string;
}
