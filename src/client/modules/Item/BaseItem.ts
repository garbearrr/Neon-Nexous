import { Players } from "@rbxts/services";
import { PlacedItems } from "../Placement/PlacedItems";
import { Plot } from "../Plot/Plot";
import { ItemFacingDirection } from "./Common";
import { Grid } from "../Grid/Grid";

export abstract class BaseItem implements BaseItemType {
    public readonly ClickDetector: BaseItemData["ClickDetector"];
    public readonly CollisionHitbox: BaseItemData["CollisionHitbox"];
    public readonly Model: BaseItemData["Model"];
    public readonly Stats: BaseItemData["Stats"];
    public readonly Part: BaseItemData & Part;

    protected CanPlace: boolean = false;
    protected CellsOccupied: Array<Vector2> = [];
    protected DragCell: GuiObject | undefined;
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

    public AsModel(): Model {
        const Clone = this.Part.Clone();
        const Model = new Instance("Model");
        Clone.Parent = Model;
        Model.PrimaryPart = Clone;
        return Model;
    }

    protected CDMouseHoverEnter(Player: Player): void {
        // if player is not the local player return
        if (Player === undefined) return;
        if (Player.Name !== Players.LocalPlayer.Name) return;
        this.CollisionHitbox.Transparency = 0.5;
    }

    protected CDMouseHoverLeave(Player: Player): void {
        if (Player === undefined) return;
        if (Player.Name !== Players.LocalPlayer.Name) return;
        this.CollisionHitbox.Transparency = 1;
    }

    public Destroy(DestroyPart = true): void {
        this.Connections.forEach((Connection) => Connection.Disconnect());
        if (DestroyPart) this.Part.Destroy();
    }

    public GetFacingDirection(): ItemFacingDirection | undefined {
        switch (Grid.GetGlobalInstance().GetItemRotation()) {
            case 0:
                return ItemFacingDirection.North;
            case 90:
                return ItemFacingDirection.West;
            case 180:
                return ItemFacingDirection.South;
            case 270:
                return ItemFacingDirection.East;
            default:
                return ItemFacingDirection.North;
        }
    }

    public GetPID(): number {
        return this.PlacementId;
    }

    /** Fires when the item is being dragged during placement. */
    public OnDragged(): void {
        this.CellsOccupied = Grid.GetGlobalInstance().GetCellsTakenUp(this.Part.Position);
        this.CanPlace = PlacedItems.CanPlace(this.CellsOccupied);

        if (!this.CanPlace && this.DragCell !== undefined) {
            this.DragCell.Visible = false;
            return;
        }
    }

    /** Fires when the items is moved during placement. */
    public OnMoved(): void {
        this.CellsOccupied = Grid.GetGlobalInstance().GetCellsTakenUp(this.Part.Position);
        this.CanPlace = PlacedItems.CanPlace(this.CellsOccupied);
    }

    /** Fires when the item is placed. */
    public OnPlaced(): void {
        // This needs to be recalculated again for some reason or else it will always be false.
        this.CellsOccupied = Grid.GetGlobalInstance().GetCellsTakenUp(this.Part.Position);
        this.CanPlace = PlacedItems.CanPlace(this.CellsOccupied);

        if (!this.CanPlace) return;
        if (this.CellsOccupied.size() === 0) return;
        this.PlacementId = PlacedItems.AddItem(this.CellsOccupied, this);
        this.Part.Parent = Plot.PlacedFolder;

        //this.ClickDetector.MaxActivationDistance = 1000;
        /* this.Connections.push(this.ClickDetector.MouseHoverEnter.Connect((Player) => this.CDMouseHoverEnter(Player)));
        this.Connections.push(this.ClickDetector.MouseHoverLeave.Connect((Player) => this.CDMouseHoverLeave(Player))); */
    }

    /** Fires when the item is selected for placement and casting begins. */
    public OnSetup(): void {}

    /** Fires when the item is removed from a drag. */
    public OnUndragged(): void {
        this.CellsOccupied = [];
        this.CanPlace = false;
    }

    public SetDragCell(Cell: GuiObject): void {
        this.DragCell = Cell;
    }
}