interface IEvent<T> {
    Connect(callback: (value: T) => void): IEventConnection<T>;
    Destroy(): void;
    Disconnect(connection: number): void;
    Fire(value: T): void;
}

interface IEventConnection<T> extends RBXScriptConnection {
    Connected: boolean;
    Connection: number;
    Event: IEvent<T>;

    Disconnect(): void;
    GetConnectionNum(): number;
}