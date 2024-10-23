import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { Event } from "shared/modules/Event/Event";
import { FireSignal } from "./FireSignal";
import { OnMove, OnPlace, OnUpdate } from "./EventClasses";
import { Input } from "../Input/Input";
import { Grid } from "./Grid";

export abstract class BaseGrid {
    protected PState: {ParentGridPart: Part, Rotation: number};

    protected ExtensionPart: Part;
    protected GridTexture: Texture;
    protected static OriginalGridTransparency: number = 0;
    protected Mouse = Players.LocalPlayer.GetMouse();

    protected FastCast = require(ReplicatedStorage.WaitForChild("FastCastRedux") as ModuleScript) as FastCast;

    protected CastBehavior: FastCastBehavior;
    protected Caster: InstanceType<FastCastConstructor> = new (this.FastCast as unknown as FastCastConstructor)();
    protected CastVelocity: number = 1000;
    protected CellOffset: Vector2 = new Vector2(0, 0);
    protected CellSkip: Vector2 = new Vector2(0, 0);
    protected Connections: Collection<string, RBXScriptConnection> = new Collection();
    protected Drag: Collection<string, CFrame> = new Collection();
    protected DragLockedHorizontal: boolean = false;
    protected DragLockedVertical: boolean = false;
    protected DragStart?: Vector3;
    protected FireSignals: Collection<string, FireSignal> = new Collection();
    protected ItemId: number = 0;
    protected ItemSize: Vector3 = new Vector3(0, 0, 0);
    protected ItemSizeCells: Vector2 = new Vector2(0, 0);
    protected LastTargetCFrame: CFrame = new CFrame();
    protected SnapSize: number = 0;

    public readonly Events = {
        OnMove: new Event<OnMove>(),
        OnPlace: new Event<OnPlace>(),
        OnRotate: new Event<number>(),
        OnUpdate: new Event<OnUpdate>(),
    };

    protected constructor(PState: {ParentGridPart: Part, Rotation: number}) {
        this.PState = PState;
        // Configure
        this.CastBehavior = this.ConfigureCastBehavior();
        this.ExtensionPart = this.ConfigureExtensionPart();
        this.GridTexture = this.ConfigureGridTexture();
        // Ray fires on mouse move
        //const DefMouseSignal = new FireSignal("Mouse", this.Mouse.Move);
        // Caster setup
        const CasterConn = this.Caster.RayHit.Connect((c, r, v, b) => this.OnRayHit(c, r, v, b));
        this.Connections.Set("Caster", CasterConn);

        const UpdateConn = RunService.RenderStepped.Connect(() => this.OnUpdate());
        this.Connections.Set("Update", UpdateConn);

        const DefUpdateSignal = new FireSignal("RStepped", RunService.RenderStepped);
        this.AddFireSignal(DefUpdateSignal);
    }

    /**
     * The signal used to initiate a raycast for item placement. E.g.: mouse move, RenderStepped, etc.
     * @param Signal The signal to use for firing the callback.
     */
    public AddFireSignal(Signal: FireSignal): this {
        this.FireSignals.Set(Signal.Name, Signal);
        _G.Log(`Added signal: ${Signal.Name}`, "BaseGrid");
        return this;
    }

    public CleanUp(): void {
        //super.CleanUp();
        this.Reset();
        _G.Log("Cleaned up BaseGrid", "BaseGrid");
    };

    protected ConfigureCastBehavior(): FastCastBehavior {
        const Behavior = this.FastCast.newBehavior();
        Behavior.AutoIgnoreContainer = false;
        Behavior.RaycastParams = new RaycastParams();
        Behavior.RaycastParams.IgnoreWater = true;
        Behavior.RaycastParams.FilterType = Enum.RaycastFilterType.Include;
        Behavior.RaycastParams.FilterDescendantsInstances = [
            this.PState.ParentGridPart
        ];
    
        _G.Log("Configured CastBehavior", "BaseGrid");
        return Behavior;
    }

    protected ConfigureExtensionPart(): Part {
        const ExtensionName = "GridExtensionPart";
        const Parent = this.PState.ParentGridPart;
        const Lookup = Parent.FindFirstChild(ExtensionName);
        if (Lookup) return Lookup as Part;

        const Extension = new Instance("Part");
        Extension.Transparency  = 1;
        Extension.Name          = ExtensionName;
        Extension.Parent        = Parent;
        Extension.CFrame        = Parent.CFrame;
        Extension.Size          = new Vector3(1000, Parent.Size.Y - 0.001, 1000);
        Extension.CanCollide    = false;
        Extension.CanTouch      = false;
        Extension.Anchored      = true;

        _G.Log("Configured ExtensionPart", "BaseGrid");
        return Extension;
    }

    protected ConfigureGridTexture(): Texture {
        const TextureName = "GridTexture";
        const TextureURL = "http://www.roblox.com/asset/?id=10640006995";
        const Parent = this.PState.ParentGridPart;
        const Lookup = Parent.FindFirstChild(TextureName);
        if (Lookup) return Lookup as Texture;

        const Texture = new Instance("Texture");
        Texture.Transparency    = 0;
        Texture.Color3          = new Color3(0, 0, 0);
        Texture.StudsPerTileU   = 3;
        Texture.StudsPerTileV   = 3;
        Texture.Face            = Enum.NormalId.Top;
        Texture.Texture         = TextureURL;
        Texture.Parent          = Parent;
        Texture.Name            = TextureName;

        BaseGrid.OriginalGridTransparency = Texture.Transparency;

        _G.Log("Configured GridTexture", "BaseGrid");
        return Texture;
    }

    protected FindClosestFraction(decimal: number, pow: number, size: number): number {
        //if (pow === 0 && size % 2 === 1) return 0.5; <- Might need this when when SnapSize is 0??
    
        const powerOfTwo = math.pow(2, pow);  // Calculate 2^n
        const scaledValue = decimal * powerOfTwo;  // Scale the value to the range [0, 2^n]
        const closestIndex = math.round(scaledValue);  // Find the nearest whole number
        const closestFraction = closestIndex / powerOfTwo;  // Scale back to [0, 1]
        return closestFraction;
    }

    protected FireCast(): void {
        // TODO: Look into how this changes with a controller
        const origin = Workspace.CurrentCamera!.CFrame.Position;
        const direction = this.Mouse.Hit.Position.sub(origin).Unit;
        this.Caster.Fire(origin, direction, this.CastVelocity, this.CastBehavior);
    }

    protected GetCellSkipAndCellOffset(): [Vector2, Vector2] {
        const ItemSizeInCells = this.GetItemSizeInCellsXY();
        const GridTexture = this.GridTexture;

        const widthEven = ItemSizeInCells.X % 2 === 0;
        const heightEven = ItemSizeInCells.Y % 2 === 0;
    
        if (!widthEven && !heightEven) {
            const cellSkip = new Vector2(
                math.floor(ItemSizeInCells.X / 2),
                math.floor(ItemSizeInCells.Y / 2)
            );
    
            const cellOffset = new Vector2(
                GridTexture.StudsPerTileU / 2,
                GridTexture.StudsPerTileV / 2
            );
    
            return [cellSkip, cellOffset];
        } else if (!widthEven && heightEven) {
            const cellSkip = new Vector2(
                math.floor(ItemSizeInCells.X / 3),
                math.floor(ItemSizeInCells.Y / 3)
            );
    
            const cellOffset = new Vector2(
                GridTexture.StudsPerTileU / 2,
                GridTexture.StudsPerTileV
            );
    
            return [cellSkip, cellOffset];
        } else if (widthEven && !heightEven) {
            const cellSkip = new Vector2(
                math.floor(ItemSizeInCells.X / 3),
                math.floor(ItemSizeInCells.Y / 3)
            );
    
            const cellOffset = new Vector2(
                GridTexture.StudsPerTileU,
                GridTexture.StudsPerTileV / 2
            );
    
            return [cellSkip, cellOffset];
        } else {
            const cellSkip = new Vector2(
                math.floor(ItemSizeInCells.X / 4),
                math.floor(ItemSizeInCells.Y / 4)
            );
    
            const cellOffset = new Vector2(
                GridTexture.StudsPerTileU,
                GridTexture.StudsPerTileV
            );
    
            return [cellSkip, cellOffset];
        }
    }

    public GetCellSize(): number {
        return this.GridTexture.StudsPerTileU;
    }

    /**
     * Get the cells the item is taking up on the grid.
     */
    public GetCellsTakenUp(Loc: Vector3): Vector2[] {
        // Top left should be 0,0 and it should increase positively on both axis down and right.
        const ItemSizeCells = this.GetItemSizeInCellsXY();
        const LocInCells = this.GetItemLocInCells(Loc);

        const CellsTakenUp: Vector2[] = [];
        for (let y = 0; y < ItemSizeCells.Y; y++) {
            for (let x = 0; x < ItemSizeCells.X; x++) {
                const CX = LocInCells.X + x;
                const CY = math.abs(LocInCells.Y + y);
                CellsTakenUp.push(new Vector2(math.floor(CX), math.floor(CY)));
            }
        }

        return CellsTakenUp;
    }

    /**
     * Get the item's location in cells on the grid from the top left cell of the item in the event it is bigger than 1x1.
     */
    public GetItemLocInCells(Loc?: Vector3): Vector2 {
        const ItemSizeCells = this.GetItemSizeInCellsXY();
        const [CellSkip, CellOffset] = this.GetCellSkipAndCellOffset();
        const Target = Loc || this.LastTargetCFrame.Position;

        const GridParent = this.PState.ParentGridPart;
        const GridTexture = this.GridTexture;

        const GridSizeCells = new Vector2(GridParent.Size.X / GridTexture.StudsPerTileU, GridParent.Size.Z / GridTexture.StudsPerTileV);
        const TopLeftGrid = new Vector2(GridParent.Position.X - GridParent.Size.X / 2, GridParent.Position.Z - GridParent.Size.Z / 2);

        const CellSizeX = GridTexture.StudsPerTileU;
        const CellSizeY = GridTexture.StudsPerTileV;

        const ClampedTarget = new Vector3(
            math.clamp(
                Target.X,
                TopLeftGrid.X                               + CellSkip.X * CellSizeX + CellOffset.X,
                TopLeftGrid.X + GridSizeCells.X * CellSizeX - CellSkip.X * CellSizeX - CellOffset.X
            ),
            GridParent.Position.Y + GridParent.Size.Y / 2 + this.ItemSize.Y / 2,
            math.clamp(
                Target.Z, 
                TopLeftGrid.Y                               + CellSkip.Y * CellSizeY + CellOffset.Y, 
                TopLeftGrid.Y + GridSizeCells.Y * CellSizeY - CellSkip.Y * CellSizeY - CellOffset.Y,
            )
        );

        const CellsAwayFromTopLeft = new Vector2(
            (ClampedTarget.X - TopLeftGrid.X) / CellSizeX,
            (TopLeftGrid.Y - ClampedTarget.Z) / CellSizeY
        );

        const NoWholeNumber = new Vector2(
            CellsAwayFromTopLeft.X - math.floor(CellsAwayFromTopLeft.X),
            CellsAwayFromTopLeft.Y - math.floor(CellsAwayFromTopLeft.Y)
        );

        const NoDecimal = new Vector2(
            math.floor(CellsAwayFromTopLeft.X),
            math.floor(CellsAwayFromTopLeft.Y)
        );

        const SnapSize = this.SnapSize;

        // Adjust for fractional cells if SnapSize is set
        const SnappedDecimal = new Vector2(
            this.FindClosestFraction(NoWholeNumber.X, SnapSize, ItemSizeCells.X),
            this.FindClosestFraction(NoWholeNumber.Y, SnapSize, ItemSizeCells.Y)
        );

        const SnappedWhole = new Vector2(
            NoDecimal.X + SnappedDecimal.X,
            NoDecimal.Y + SnappedDecimal.Y
        );

        return SnappedWhole;
    }

    /**
     * Get the current rotation of the item being placed in degrees.
     */
    public GetItemRotation(): number {
        return this.PState.Rotation;
    }

    public GetItemSizeInCellsXY(Item?: Part): Vector2 {
        const ItemSize = Item ? Item.Size : this.ItemSize;
        const shouldflip = this.PState.Rotation / 90 === 1 || this.PState.Rotation / 90 === 3;
    
        const ObjectSizeX = shouldflip ? ItemSize.Z / this.GridTexture.StudsPerTileV : ItemSize.X / this.GridTexture.StudsPerTileU;
        const ObjectSizeY = shouldflip ? ItemSize.X / this.GridTexture.StudsPerTileU : ItemSize.Z / this.GridTexture.StudsPerTileV;
    
        return new Vector2(ObjectSizeX, ObjectSizeY);
    }

    public GetWorldPositionFromCell(cell: Vector2): Vector3 {
        const GridParent = this.PState.ParentGridPart;
        const GridTexture = this.GridTexture;
    
        const CellSizeX = GridTexture.StudsPerTileU;
        const CellSizeY = GridTexture.StudsPerTileV;
    
        const TopLeftGrid = new Vector2(
            GridParent.Position.X - GridParent.Size.X / 2,
            GridParent.Position.Z - GridParent.Size.Z / 2
        );
    
        const PositionX = TopLeftGrid.X + cell.X * CellSizeX + CellSizeX / 2;
        const PositionY = GridParent.Position.Y + GridParent.Size.Y / 2 + this.ItemSize.Y / 2;
        const PositionZ = TopLeftGrid.Y - cell.Y * CellSizeY - CellSizeY / 2;
    
        return new Vector3(PositionX, PositionY, PositionZ);
    }
    

    public IsPlaceButtonDown(): boolean {
        // TODO: Add controller input.
        const KbMouse = Input.Controls.KeyboardMouse.GridItemPlace;
        return KbMouse.IsDown(true);
    }

    public LockDragHorizontal(): this {
        this.DragLockedHorizontal = true;
        this.DragLockedVertical = false;
        _G.Log("Locked Drag Horizontal", "BaseGrid");
        return this;
    }

    public LockDragVertical(): this {
        this.DragLockedVertical = true;
        this.DragLockedHorizontal = false;
        _G.Log("Locked Drag Vertical", "BaseGrid");
        return this;
    }

    public MaxItemsPossible(Item: Part): number {
        const GridTexture = this.GridTexture;
        const GridSize = this.PState.ParentGridPart.Size;

        const GridSizeCells = new Vector2(GridSize.X / GridTexture.StudsPerTileU, GridSize.Z / GridTexture.StudsPerTileV);
        const ItemSizeCells = this.GetItemSizeInCellsXY(Item);

        return GridSizeCells.X * GridSizeCells.Y / (ItemSizeCells.X * ItemSizeCells.Y);
    }

    protected OnRayHit(_c: ActiveCast, Res: RaycastResult, _v: Vector3, _b: Instance) {
        const GridParent = this.PState.ParentGridPart;
        const GridTexture = this.GridTexture;

        const GridSizeCells = new Vector2(GridParent.Size.X / GridTexture.StudsPerTileU, GridParent.Size.Z / GridTexture.StudsPerTileV);
        const TopLeftGrid = new Vector2(GridParent.Position.X - GridParent.Size.X / 2, GridParent.Position.Z - GridParent.Size.Z / 2);

        const CellSizeX = GridTexture.StudsPerTileU;
        const CellSizeY = GridTexture.StudsPerTileV;

        const Target = Res.Position;

        // Clamping area to grid and possibly if there are cells to skip around the outside.
        const ClampedTarget = new Vector3(
            math.clamp(
                Target.X,
                TopLeftGrid.X                               + this.CellSkip.X * CellSizeX + this.CellOffset.X,
                TopLeftGrid.X + GridSizeCells.X * CellSizeX - this.CellSkip.X * CellSizeX - this.CellOffset.X
            ),
            GridParent.Position.Y + GridParent.Size.Y / 2 + this.ItemSize.Y / 2,
            math.clamp(
                Target.Z, 
                TopLeftGrid.Y                               + this.CellSkip.Y * CellSizeY + this.CellOffset.Y, 
                TopLeftGrid.Y + GridSizeCells.Y * CellSizeY - this.CellSkip.Y * CellSizeY - this.CellOffset.Y,
            )
        );

        const CellsAwayFromTopLeft = new Vector2(
            (ClampedTarget.X - TopLeftGrid.X) / CellSizeX,
            (TopLeftGrid.Y - ClampedTarget.Z) / CellSizeY
        );

        const NoWholeNumber = new Vector2(
            CellsAwayFromTopLeft.X - math.floor(CellsAwayFromTopLeft.X),
            CellsAwayFromTopLeft.Y - math.floor(CellsAwayFromTopLeft.Y)
        );

        const NoDecimal = new Vector2(
            math.floor(CellsAwayFromTopLeft.X),
            math.floor(CellsAwayFromTopLeft.Y)
        );

        const ItemSizeCells = this.ItemSizeCells;

        const SnappedDecimal = new Vector2(
            this.FindClosestFraction(NoWholeNumber.X, this.SnapSize, ItemSizeCells.X),
            this.FindClosestFraction(NoWholeNumber.Y, this.SnapSize, ItemSizeCells.Y)
        );

        const SnappedWhole = new Vector2(
            NoDecimal.X + SnappedDecimal.X,
            NoDecimal.Y + SnappedDecimal.Y
        );

        const TargetPosition = new Vector3(
            TopLeftGrid.X + SnappedWhole.X * CellSizeX,
            ClampedTarget.Y,
            TopLeftGrid.Y - SnappedWhole.Y * CellSizeY
        );

        const TargetOrientation = new Vector3(0, math.rad(this.PState.Rotation), 0);

        this.LastTargetCFrame = new CFrame(TargetPosition).mul(
            CFrame.Angles(0, TargetOrientation.Y, 0)
        );

        this.Events.OnMove.Fire(new OnMove(this.ItemId, TargetPosition, TargetOrientation));
    }

    protected OnUpdate(): void {
        wait();
        this.Events.OnUpdate.Fire(
            new OnUpdate(
                this.ItemId,
                this.Drag.Values()
            )
        );
    }
    
    protected Place(): void {
        this.Events.OnPlace.Fire(
            new OnPlace(
                this.ItemId, 
                this.Drag.Size() > 0 ? this.Drag.Values() : [this.LastTargetCFrame]
            )
        );

        this.Drag.Clear();
        this.DragStart = undefined;
        _G.Log("Placed item", "BaseGrid");
    }

    /**
     * Resets the grid to its original state and destroys the instance.
     * @param forgetParent If true, the texture and extension part will be destroyed. You will have to pass another parent next time Grid.Instance is called.
     */
    public Reset(forgetParent = false): void {
        this.GridTexture.Transparency = BaseGrid.OriginalGridTransparency;

        if (forgetParent) {
            //BaseGrid.ParentGridPart = undefined;
            this.ExtensionPart.Destroy();
            this.GridTexture.Destroy();
        }

        this.Connections.ForEach((Connection) => Connection.Disconnect());
        this.Connections.Clear();
        this.Drag.Clear();
        _G.Log("Reset BaseGrid", "BaseGrid");
    }

    protected Rotate(rotation: number = 90): void {
        this.PState.Rotation += rotation;
        if (this.PState.Rotation >= 360){
            this.PState.Rotation -= 360;
        }

        if (this.IsPlaceButtonDown()) return;
    
        const ItemSizeCells = this.GetItemSizeInCellsXY();
        const [CellSkip, CellOffset] = this.GetCellSkipAndCellOffset();

        this.ItemSizeCells = ItemSizeCells;
        this.CellSkip = CellSkip;
        this.CellOffset = CellOffset;

        this.Events.OnRotate.Fire(this.PState.Rotation);
        
        this.FireCast();
        _G.Log(`Rotated item to ${this.PState.Rotation} degrees`, "BaseGrid");
    }

    /**
     * Start casting with an item to be placed on the grid.
     * @param Item Item to be placed on the grid.
     * @param id  ID of the item for identification on connected placement events.
     */
    public StartCasting(Item: BasePart, id: number): this {
        this.ItemSize = Item.Size;
        this.ItemSizeCells = this.GetItemSizeInCellsXY();
        [this.CellSkip, this.CellOffset] = this.GetCellSkipAndCellOffset();
        this.ItemId = id;

        this.Connections.Get("grid_rotate")?.Disconnect();
        this.Connections.Set(
            "grid_rotate",
            Input.Controls.KeyboardMouse.GridItemRotate.OnDown("GridItemRotate", () => this.Rotate())
        );

        this.Connections.Get("grid_place")?.Disconnect();
        this.Connections.Set(
            "grid_place",
            Input.Controls.KeyboardMouse.GridItemPlace.OnUp("GridItemPlaceUp", () => this.Place())
                .IgnoreGameProcessedEvent(true)
        )
    
        for (const FireSignal of this.FireSignals.Values()) {
            const Connection = FireSignal.Signal.Connect(() => {
                this.FireCast();
            });

            this.Connections.Get(FireSignal.Name)?.Disconnect();
            this.Connections.Set(FireSignal.Name, Connection);
            FireSignal.Connection = Connection;
        }

        this.DragLockedHorizontal = false;
        this.DragLockedVertical = false;

        this.FireCast();

        _G.Log("Started casting", "BaseGrid");
        return this;
    }

    public ToggleGrid(on?: boolean): this {
        if(on === undefined) {
            on = this.GridTexture.Transparency === BaseGrid.OriginalGridTransparency;
        }

        this.GridTexture.Transparency = on ? BaseGrid.OriginalGridTransparency : 1;

        _G.Log(`Toggled grid ${on ? "on" : "off"}`, "BaseGrid");
        return this;
    }
}

