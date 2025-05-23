import { Players } from "@rbxts/services";
import { PlacedItems } from "../Placement/PlacedItems";
import { Plot } from "../Plot/Plot";
import { ItemFacingDirection } from "./Common";
import { BuildModes, Grid } from "../Grid/Grid";
import { Common } from "shared/modules/Common/Common";
import { Collection } from "shared/modules/Collection/Collection";
import { ItemActions } from "./ItemActions";
import { Inventory } from "../Inventory/Inventory";



export abstract class BaseItem implements BaseItemType {
    public readonly ClickDetector: BaseItemData["ClickDetector"];
    public readonly CollisionHitbox: BaseItemData["CollisionHitbox"];
    public readonly Model: BaseItemData["Model"];
    public readonly Stats: BaseItemData["Stats"];
    public readonly Part: BaseItemData & Part;

    protected CanPlace: boolean = false;
    protected CanReplace: boolean = false;
    protected CellsOccupied: Array<Vector2> = [];
    protected Destroyed = false;
    protected DragCell: GuiObject | undefined;
    protected OutOfItems = false;
    protected PlacementId: number;

    protected readonly BoxTransparency: number = 0;
    protected readonly SurfaceTransparency: number = 0.5;
    protected readonly NoBorderTransparency: number = 0.6;
    protected readonly NormalBoxColor = Color3.fromRGB(0, 0, 0);
    protected readonly OutOfItemsBoxColor = Color3.fromRGB(255, 90, 0);
    protected readonly OverlapBoxColor = Color3.fromRGB(255, 0, 0);
    protected readonly ReplaceBoxColor = Color3.fromRGB(255, 255, 0);

    protected readonly HoverCursor = "http://www.roblox.com/asset/?id=133120883849698";
    protected IsActionClicked = false;

    // Typically, this would be a collection, but there may be many instances
    // of an item, so we will save some memory by using an array.
    protected readonly Connections: Collection<string, RBXScriptConnection> = new Collection();

    public constructor(Item: BaseItemData & Part) {
        this.ClickDetector = Item.ClickDetector;
        this.CollisionHitbox = Item.CollisionHitbox;
        this.Model = Item.Model;
        this.Stats = Item.Stats;
        this.Part = Item;
        this.PlacementId = -1;
    }

    protected ActionClickUndo(): void {
        this.IsActionClicked = false;
        this.CDMouseHoverLeave(Players.LocalPlayer);
    }

    public ActivateClickDetector(): void {
        this.ClickDetector.MaxActivationDistance = 1000;
        this.ClickDetector.CursorIcon = this.HoverCursor;
        this.Connections.Set("cd_click", this.ClickDetector.MouseClick.Connect((Player) => this.CDMouseClick(Player)));
        this.Connections.Set("cd_enter", this.ClickDetector.MouseHoverEnter.Connect((Player) => this.CDMouseHoverEnter(Player)));
        this.Connections.Set("cd_leave", this.ClickDetector.MouseHoverLeave.Connect((Player) => this.CDMouseHoverLeave(Player)));
        _G.Log(`Click Detector activated for ${this.Stats.ItemName.Value} ${this.PlacementId}`, "BaseItem");
    }

    public AsModel(): Model {
        const Clone = this.Part.Clone();
        const Model = new Instance("Model");
        Clone.Parent = Model;
        Model.PrimaryPart = Clone;
        return Model;
    }

    protected CDMouseClick(Player: Player): void {
        if (Player === undefined) return;
        if (Player.Name !== Players.LocalPlayer.Name) return;
        if (this.IsActionClicked) return;

        this.IsActionClicked = true;
        this.CDMouseHoverEnter(Player);
        ItemActions.ShowActionsUI(this, () => this.ActionClickUndo());
        _G.Log(`Click detected for ${this.Stats.ItemName.Value} ${this.PlacementId}`, "BaseItem");
    }

    protected CDMouseHoverEnter(Player: Player): void {
        // if player is not the local player return
        if (Player === undefined) return;
        if (Player.Name !== Players.LocalPlayer.Name) return;
        this.ShowHitbox();

        if (ItemActions.IsActionUIOpen()) return;
        ItemActions.ShowBasicUI(this.Stats.ItemName.Value, this.Stats.Icon.Value);
        _G.Log(`Hover detected for ${this.Stats.ItemName.Value} ${this.PlacementId}`, "BaseItem");
    }

    protected CDMouseHoverLeave(Player: Player): void {
        if (Player === undefined) return;
        if (Player.Name !== Players.LocalPlayer.Name) return;
        if (this.IsActionClicked) return;
        this.HideHitbox();

        if (ItemActions.IsActionUIOpen()) return;
        ItemActions.HideUI();
        _G.Log(`Hover leave detected for ${this.Stats.ItemName.Value} ${this.PlacementId}`, "BaseItem");
    }

    public ChangeBoxColor(): void {
        this.CollisionHitbox.SelectionBox.Color3 =
            this.OutOfItems
            ? this.OutOfItemsBoxColor
            : this.CanPlace 
            ? this.NormalBoxColor
            : this.CanReplace
            ? this.ReplaceBoxColor
            : this.OverlapBoxColor;
    }

    public DeactivateClickDetector(): void {
        this.ClickDetector.MaxActivationDistance = 0;
        this.Connections.Get("cd_enter")?.Disconnect();
        this.Connections.Get("cd_leave")?.Disconnect();
        this.Connections.Get("cd_click")?.Disconnect();
        this.IsActionClicked = false;
        ItemActions.HideUI();
        _G.Log(`Click Detector deactivated for ${this.PlacementId}`, "BaseItem");
    }

    public Destroy(DestroyPart = true): void {
        this.Connections.ForEach((Connection) => Connection.Disconnect());
        _G.Log(`Destroyed ${this.Stats.ItemName.Value} ${this.PlacementId} Part Destroyed: ${DestroyPart}`, "BaseItem");
        if (DestroyPart) this.Part.Destroy(); 
        this.Destroyed = true;
    }

    public GetBuildModeType(): keyof BuildModes {
        return "LineDragGrid";
    }

    public GetCategory(): string {
        return Common.GetItemCategoryById(this.Stats.ItemId.Value) || "Unknown";
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

    public HideHitbox(): void {
        this.CollisionHitbox.SelectionBox.Transparency = 1;
        this.CollisionHitbox.SelectionBox.SurfaceTransparency = 1;
        this.CollisionHitbox.SelectionBox.Color3 = this.NormalBoxColor;
        _G.Log(`Hitbox hidden for ${this.Stats.ItemName.Value} ${this.PlacementId}`, "BaseItem");
    }

    /** Fires when the item is being dragged during placement. */
    public OnDragged(): void {
        this.CellsOccupied = Grid.GetGlobalInstance().GetCellsTakenUp(this.Part.Position);
        this.CanPlace = PlacedItems.CanPlace(this.CellsOccupied);
        this.CanReplace = PlacedItems.CanReplace(this.CellsOccupied, this.GetCategory());

        if (!this.CanPlace && this.DragCell !== undefined) {
            this.DragCell.Visible = false;
            return;
        }

        this.ChangeBoxColor();
    }

    /** Fires when the items is moved during placement. */
    public OnMoved(): void {
        this.CellsOccupied = Grid.GetGlobalInstance().GetCellsTakenUp(this.Part.Position);
        this.CanPlace = PlacedItems.CanPlace(this.CellsOccupied);
        this.CanReplace = PlacedItems.CanReplace(this.CellsOccupied, this.GetCategory());
        this.ChangeBoxColor();
    }

    /** Fires when the item is placed. */
    public OnPlaced(): void {
        const InvAmount = Inventory.GetItem(this.Stats.ItemId.Value);
        if (InvAmount === undefined) return this.Destroy(true);

        // This needs to be recalculated again for some reason or else it will always be false.
        this.CellsOccupied = Grid.GetGlobalInstance().GetCellsTakenUp(this.Part.Position);
        this.CanPlace = PlacedItems.CanPlace(this.CellsOccupied);
        this.CanReplace = PlacedItems.CanReplace(this.CellsOccupied, this.GetCategory());

        // Have to do this first or else it will think its replacing itself
        const Replaceable = PlacedItems.GetReplaceableItem(this.CellsOccupied, this.GetCategory());

        if (!this.CanPlace && !this.CanReplace) return this.Destroy(true);
        if (this.CellsOccupied.size() === 0) return this.Destroy(true);

        if (this.CanReplace && Replaceable !== undefined) {
            const ReplacedName = Replaceable.Stats.ItemName.Value;
            const RPID = Replaceable.GetPID();

            Inventory.AddItem(Replaceable.Stats.ItemId.Value);
            PlacedItems.RemoveItem(RPID);

            _G.Log(`Replaced ${ReplacedName} ${RPID}`, "BaseItem");
        }

        this.PlacementId = PlacedItems.AddItem(this.CellsOccupied, this);
        this.Part.Parent = Plot.PlacedFolder;

        this.CollisionHitbox.SelectionBox.Color3 = this.NormalBoxColor;
        this.ShowHitbox(false);
        Inventory.RemoveItem(this.Stats.ItemId.Value);
        this.OutOfItems = false;

        _G.Log(`Placed ${this.Stats.ItemName.Value} ${this.PlacementId}`, "BaseItem");
    }

    /** Fires when the item is selected for placement and casting begins. */
    public OnSetup(): void {
        _G.Log(`Setup for ${this.Stats.ItemName.Value}`, "BaseItem");
    }

    /** Fires when the item is removed from a drag. */
    public OnUndragged(): void {
        this.CellsOccupied = [];
        this.CanPlace = false;
        this.CanReplace = false;
    }

    public SetDragCell(Cell: GuiObject): void {
        this.DragCell = Cell;
    }

    public SetOutOfItems(OutOfItems: boolean): void {
        this.OutOfItems = OutOfItems;
    }

    public ShowHitbox(withBorder = true): void {
        this.CollisionHitbox.SelectionBox.Transparency = withBorder ? this.BoxTransparency : this.NoBorderTransparency;
        this.CollisionHitbox.SelectionBox.SurfaceTransparency = this.SurfaceTransparency;
        this.CollisionHitbox.SelectionBox.Adornee = this.CollisionHitbox;
        _G.Log(`Hitbox shown for ${this.Stats.ItemName.Value} ${this.PlacementId}`, "BaseItem");
    }
}