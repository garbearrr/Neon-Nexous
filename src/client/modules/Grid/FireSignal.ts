export class FireSignal {

    public Name: string;
    public Signal: RBXScriptSignal<Callback>;
    public Connection?: RBXScriptConnection;
    
    public constructor(name: string, Signal: RBXScriptSignal<Callback>) {
        this.Name = name;
        this.Signal = Signal;
    }

    public Disconnect(): void {
        if (this.Connection) this.Connection.Disconnect();
    }
}