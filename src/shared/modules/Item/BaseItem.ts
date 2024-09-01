export abstract class BaseItem implements BaseItemData{
    public readonly ClickDetector: BaseItemData["ClickDetector"];
    public readonly CollisionHitbox: BaseItemData["CollisionHitbox"];
    public readonly Model: BaseItemData["Model"];
    public readonly Stats: BaseItemData["Stats"];
    public readonly Part: BaseItemData & Part;

    // Typically, this would be a collection, but there may be many instances
    // of an item, so we will save some memory by using an array.
    protected readonly Connections: Array<RBXScriptConnection> = [];

    public constructor(Item: BaseItemData & Part) {
        this.ClickDetector = Item.ClickDetector;
        this.CollisionHitbox = Item.CollisionHitbox;
        this.Model = Item.Model;
        this.Stats = Item.Stats;
        this.Part = Item;
    }

    public Destroy(): void {
        this.Connections.forEach((Connection) => Connection.Disconnect());
        this.Part.Destroy();
    }

    /** Fires when the item is being dragged during placement. */
    public OnDragged(): void {}

    /** Fires when the items is moved during placement. */
    public OnMoved(): void {}

    /** Fires when the item is placed. */
    public OnPlaced(): void {}

    /** Fires when the item is selected for placement and casting begins. */
    public OnSetup(): void {}

    /** Fires when the item is removed from a drag. */
    public OnUndragged(): void {}
}