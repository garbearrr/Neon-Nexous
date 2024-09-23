
export class Event<T> implements IEvent<T>{
    private Connections: Map<number, (value: T) => void> = new Map();

    public constructor() {}

    // Methods

    public Connect(callback: (value: T) => void): EventConnection<T> {
        const Identifier = os.time();
		this.Connections.set(Identifier, callback);
		return new EventConnection(Identifier, this);
    }

    public Destroy(): void {
        this.Connections.clear();
    }

    public Disconnect(connection: number): void {
        this.Connections.delete(connection);
    }

    public Fire(value: T): void {
        this.Connections.forEach((fn) => fn(value));
    }
}

class EventConnection<T> implements IEventConnection<T> {
    Connected: boolean = true;
    Connection: number;
    Event: Event<T>;

    public constructor(Conn: number, E: Event<T>) {
        this.Connection = Conn;
        this.Event = E;
    }

    public Disconnect(): void {
        this.Connected = false;
        this.Event.Disconnect(this.Connection);
    }

    public GetConnectionNum(): number {
        return this.Connection;
    }
}