import { Grid } from "../Grid/Grid";
import { PlacedItems } from "../Placement/PlacedItems";
import { Plot } from "../Plot/Plot";

export abstract class BaseItem implements BaseItemType {
    public readonly ClickDetector: BaseItemData["ClickDetector"];
    public readonly CollisionHitbox: BaseItemData["CollisionHitbox"];
    public readonly Model: BaseItemData["Model"];
    public readonly Stats: BaseItemData["Stats"];
    public readonly Part: BaseItemData & Part;

    protected CanPlace: boolean = false;
    protected CellsOccupied: Array<Vector2> = [];
    protected PlacementId: number;

    // Typically, this would be a collection, but there may be many instances
    // of an item, so we will save some memory by using an array.
    protected readonly Connections: Array<RBXScriptConnection> = [];

    public constructor(Item: BaseItemData & Part) {
        this.ClickDetector = Item.ClickDetector;
        this.CollisionHitbox = Item.CollisionHitbox;
        this.Model = Item.Model;
        this.Stats = Item.Stats;
        this.Part = Item;
        this.PlacementId = -1;
    }

    public Destroy(): void {
        this.Connections.forEach((Connection) => Connection.Disconnect());
        this.Part.Destroy();
    }

    public GetPID(): number {
        return this.PlacementId;
    }

    /** Fires when the item is being dragged during placement. */
    public OnDragged(): void {
        this.CellsOccupied = Grid.Instance().GetCellsTakenUp(this.Part.Position);
        this.CanPlace = PlacedItems.CanPlace(this.CellsOccupied);
    }

    /** Fires when the items is moved during placement. */
    public OnMoved(): void {
        this.CellsOccupied = Grid.Instance().GetCellsTakenUp(this.Part.Position);
        this.CanPlace = PlacedItems.CanPlace(this.CellsOccupied);
    }

    /** Fires when the item is placed. */
    public OnPlaced(): void {
        // This needs to be recalculated again for some reason or else it will always be false.
        this.CellsOccupied = Grid.Instance().GetCellsTakenUp(this.Part.Position);
        print("CellsOccupied", this.CellsOccupied);
        this.CanPlace = PlacedItems.CanPlace(this.CellsOccupied);

        if (!this.CanPlace) return;
        if (this.CellsOccupied.size() === 0) return;
        this.PlacementId = PlacedItems.AddItem(this.CellsOccupied, this);
        this.Part.Parent = Plot.PlacedFolder;
    }

    /** Fires when the item is selected for placement and casting begins. */
    public OnSetup(): void {}

    /** Fires when the item is removed from a drag. */
    public OnUndragged(): void {
        this.CellsOccupied = [];
        this.CanPlace = false;
    }
}