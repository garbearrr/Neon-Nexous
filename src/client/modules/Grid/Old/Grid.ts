import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { Event } from "shared/modules/Event/Event";
import { Input } from "../../Input/Input";

const Mouse = Players.LocalPlayer.GetMouse();

export class GridOld {
    private static _instance?: GridOld;

    // Persistant State
    private static ParentGridPart?: Part;
    private static Rotation = 0;

    private ExtensionPart: Part = this.ConfigureExtensionPart();
    private GridTexture: Texture = this.ConfigureGridTexture();
    private OriginalGridTransparency: number = this.GridTexture.Transparency;

    private FastCast = require(ReplicatedStorage.WaitForChild("FastCastRedux") as ModuleScript) as FastCast;

    private CastBehavior: FastCastBehavior = this.ConfigureCastBehavior();
    private Caster: InstanceType<FastCastConstructor> = new (this.FastCast as unknown as FastCastConstructor)();
    private CastVelocity: number = 1000;
    private CellOffset: Vector2 = new Vector2(0, 0);
    private CellSkip: Vector2 = new Vector2(0, 0);
    private Connections: Collection<string, RBXScriptConnection> = new Collection();
    private Drag: CFrame[] = [];
    private DragLockedHorizontal: boolean = false;
    private DragLockedVertical: boolean = false;
    private DragStart?: Vector2;
    private FireSignals: Collection<string, FireSignal> = new Collection();
    private ItemId: number = 0;
    private ItemSize: Vector3 = new Vector3(0, 0, 0);
    private ItemSizeCells: Vector2 = new Vector2(0, 0);
    private LastTargetCFrame: CFrame = new CFrame();
    private SnapSize: number = 0;

    public readonly Events = {
        OnDrag: new Event<OnDrag>(),
        OnMove: new Event<OnMove>(),
        OnPlace: new Event<OnPlace>(),
        OnRotate: new Event<number>()
    };

    public static Instance(GridParent?: Part): GridOld {
        if (GridOld._instance !== undefined) return GridOld._instance;
        if (GridParent === undefined && GridOld.ParentGridPart === undefined) {
            return error("ParentGridPart must be provided to create a GridOld instance.");
        }

        GridOld.ParentGridPart = GridParent || GridOld.ParentGridPart;
        return GridOld._instance = new GridOld();
    }

    private constructor() {
        // TODO: Add fire singlas for controller etc.
        const DefMouseSignal = new FireSignal("Mouse", Players.LocalPlayer.GetMouse().Move);
        this.AddFireSignal(DefMouseSignal);

        const CasterConn = this.Caster.RayHit.Connect((c, r, v, b) => this.OnRayHit(c, r, v, b));
        this.Connections.Set("Caster", CasterConn);
    }

    /**
     * The signal used to initiate a raycast for item placement. Default e.g.: mouse move.
     * @param Signal The signal to use for firing the callback.
     */
    public AddFireSignal(Signal: FireSignal): this {
        this.FireSignals.Set(Signal.Name, Signal);
        return this;
    }

    private ConfigureCastBehavior(): FastCastBehavior {
        const Behavior = this.FastCast.newBehavior();
        Behavior.AutoIgnoreContainer = false;
        Behavior.RaycastParams = new RaycastParams();
        Behavior.RaycastParams.IgnoreWater = true;
        Behavior.RaycastParams.FilterType = Enum.RaycastFilterType.Include;
        Behavior.RaycastParams.FilterDescendantsInstances = [
            GridOld.ParentGridPart!
        ];
    
        return Behavior;
    }

    private ConfigureExtensionPart(): Part {
        const ExtensionName = "GridExtensionPart";
        const Parent = GridOld.ParentGridPart!;
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

        return Extension;
    }

    private ConfigureGridTexture(): Texture {
        const TextureName = "GridTexture";
        const TextureURL = "http://www.roblox.com/asset/?id=10640006995";
        const Parent = GridOld.ParentGridPart!;
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

        return Texture;
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

    
    private GetCellSkipAndCellOffset(): [Vector2, Vector2] {
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

    /**
     * Get the item's location in cells on the grid from the top left cell of the item in the event it is bigger than 1x1.
     */
    public GetItemLocInCells(Loc?: Vector3): Vector2 {
        const ItemSizeCells = this.GetItemSizeInCellsXY();
        const [CellSkip, CellOffset] = this.GetCellSkipAndCellOffset();
        const Target = Loc || this.LastTargetCFrame.Position;

        const GridParent = GridOld.ParentGridPart!;
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
        return GridOld.Rotation;
    }

    private FindClosestFraction(decimal: number, pow: number, size: number): number {
        //if (pow === 0 && size % 2 === 1) return 0.5; <- Might need this when when SnapSize is 0??
    
        const powerOfTwo = math.pow(2, pow);  // Calculate 2^n
        const scaledValue = decimal * powerOfTwo;  // Scale the value to the range [0, 2^n]
        const closestIndex = math.round(scaledValue);  // Find the nearest whole number
        const closestFraction = closestIndex / powerOfTwo;  // Scale back to [0, 1]
        return closestFraction;
    }

    private FireCast(): void {
        // TODO: Look into how this changes with a controller
        const origin = Workspace.CurrentCamera!.CFrame.Position;
        const direction = Mouse.Hit.Position.sub(origin).Unit;
        this.Caster.Fire(origin, direction, this.CastVelocity, this.CastBehavior);
    }

    public GetCellSize(): number {
        return this.GridTexture.StudsPerTileU;
    }

    public GetFireSignals(): Collection<string, FireSignal> {
        return this.FireSignals;
    }

    public GetGridBottomLeftCF(): CFrame {
        const GridParent = GridOld.ParentGridPart!;
        return new CFrame(GridParent.Position.X - GridParent.Size.X / 2, GridParent.Position.Y, GridParent.Position.Z + GridParent.Size.Z / 2);
    }

    public GetGridBottomRightCF(): CFrame {
        const GridParent = GridOld.ParentGridPart!;
        return new CFrame(GridParent.Position.X + GridParent.Size.X / 2, GridParent.Position.Y, GridParent.Position.Z + GridParent.Size.Z / 2);
    }

    public GetGridSizeInCells(): Vector2 {
        const GridParent = GridOld.ParentGridPart!;
        const GridTexture = this.GridTexture;

        return new Vector2(
            GridParent.Size.X / GridTexture.StudsPerTileU,
            GridParent.Size.Z / GridTexture.StudsPerTileV
        );
    }

    public GetGridTopLeftCF(): CFrame {
        const GridParent = GridOld.ParentGridPart!;
        return new CFrame(GridParent.Position.X - GridParent.Size.X / 2, GridParent.Position.Y, GridParent.Position.Z - GridParent.Size.Z / 2);
    }

    public GetGridTopRightCF(): CFrame {
        const GridParent = GridOld.ParentGridPart!;
        return new CFrame(GridParent.Position.X + GridParent.Size.X / 2, GridParent.Position.Y, GridParent.Position.Z - GridParent.Size.Z / 2);
    }

    public GetItemSizeInCellsXY(): Vector2 {
        const ItemSize = this.ItemSize;
        const shouldflip = GridOld.Rotation / 90 === 1 || GridOld.Rotation / 90 === 3;
    
        const ObjectSizeX = shouldflip ? ItemSize.Z / this.GridTexture.StudsPerTileV : ItemSize.X / this.GridTexture.StudsPerTileU;
        const ObjectSizeY = shouldflip ? ItemSize.X / this.GridTexture.StudsPerTileU : ItemSize.Z / this.GridTexture.StudsPerTileV;
    
        return new Vector2(ObjectSizeX, ObjectSizeY);
    }

    public IsPlaceButtonDown(): boolean {
        // TODO: Add controller input.
        const KbMouse = Input.Controls.KeyboardMouse.GridItemPlace;
        return KbMouse.IsDown(true);
    }

    public LockDragHorizontal(): this {
        this.DragLockedHorizontal = true;
        this.DragLockedVertical = false;
        return this;
    }

    public LockDragVertical(): this {
        this.DragLockedVertical = true;
        this.DragLockedHorizontal = false;
        return this;
    }

    private OnRayHit(_c: ActiveCast, Res: RaycastResult, _v: Vector3, _b: Instance) {
        const GridParent = GridOld.ParentGridPart!;
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

        const TargetOrientation = new Vector3(0, math.rad(GridOld.Rotation), 0);

        this.LastTargetCFrame = new CFrame(TargetPosition).mul(
            CFrame.Angles(0, TargetOrientation.Y, 0)
        );

        this.Events.OnMove.Fire(new OnMove(this.ItemId, TargetPosition, TargetOrientation));

        const IsDown = this.IsPlaceButtonDown();

        if (IsDown && this.DragStart === undefined) {
            this.DragStart = new Vector2(TargetPosition.X, TargetPosition.Z);
            return;
        }

        if (!IsDown) return;
        
        const CellsAwayFromDragStart = new Vector2(
            (TargetPosition.X - this.DragStart!.X) / CellSizeX,
            (this.DragStart!.Y - TargetPosition.Z) / CellSizeY
        );
        
        const FlooredAwayFromDragStart = new Vector2(
            math.floor(CellsAwayFromDragStart.X),
            math.floor(CellsAwayFromDragStart.Y)
        );

        const IncreaseBy = new Vector2(
            FlooredAwayFromDragStart.X / ItemSizeCells.X,
            FlooredAwayFromDragStart.Y / ItemSizeCells.Y
        );

        const FlooredIncreaseBy = new Vector2(
            !this.DragLockedVertical ? math.floor(IncreaseBy.X) : 0,
            !this.DragLockedHorizontal ? math.floor(IncreaseBy.Y * -1) : 0
        );

        const AbsIncreaseBy = new Vector2(
            math.abs(FlooredIncreaseBy.X),
            math.abs(FlooredIncreaseBy.Y)
        );

        const NewDragCache: CFrame[] = [];
        const StartCF = new CFrame(this.DragStart!.X, TargetPosition.Y, this.DragStart!.Y).mul(CFrame.Angles(0, TargetOrientation.Y, 0));
        NewDragCache.push(StartCF);

        for (let y = 0; y < AbsIncreaseBy.Y + 1; y++) {

            for (let x = 1; x < AbsIncreaseBy.X + 1; x++) {
                const Pos = new Vector3(
                    this.DragStart!.X + x * ItemSizeCells.X * CellSizeX * (FlooredIncreaseBy.X < 0 ? -1 : 1),
                    TargetPosition.Y,
                    this.DragStart!.Y + y * ItemSizeCells.Y * CellSizeY * (FlooredIncreaseBy.Y < 0 ? -1 : 1)
                );

                const CF = new CFrame(Pos).mul(
                    CFrame.Angles(0, TargetOrientation.Y, 0)
                );

                NewDragCache.push(CF);
            }

            if (y === 0) continue;

            const Pos = new Vector3(
                this.DragStart!.X,
                TargetPosition.Y,
                this.DragStart!.Y + y * ItemSizeCells.Y * CellSizeY * (FlooredIncreaseBy.Y < 0 ? -1 : 1)
            );

            const CF = new CFrame(Pos).mul(
                CFrame.Angles(0, TargetOrientation.Y, 0)
            );

            NewDragCache.push(CF);
        }
        if (NewDragCache.size() === this.Drag.size()) return;

        if (this.Drag.size() > NewDragCache.size()) {
            const Removed = this.Drag.filter((CF) => {
                return !NewDragCache.some((Pos) => {
                    return Pos.Position === CF.Position;
                });
            });

            this.Drag = NewDragCache;

            this.Events.OnDrag.Fire(
                new OnDrag(false, Removed)
            );
        } else {
            const Added = NewDragCache.filter((CF) => {
                return !this.Drag.some((Pos) => {
                    return Pos.Position === CF.Position;
                });
            });

            this.Drag = NewDragCache;

            this.Events.OnDrag.Fire(
                new OnDrag(true, Added)
            );
        }
    }

    private Place(): void {
        this.Events.OnPlace.Fire(
            new OnPlace(
                this.ItemId, 
                this.Drag.size() > 0 ? this.Drag : [this.LastTargetCFrame]
            )
        );

        this.Drag = [];
        this.DragStart = undefined;
    }

    public RemoveFireSignals(...signalName: string[]): this {
        for (const SignalName of signalName) {
            this.FireSignals.Get(SignalName)?.Disconnect();
            this.FireSignals.Delete(SignalName);
        }

        return this;
    }

    /**
     * Resets the grid to its original state and destroys the instance.
     * @param forgetParent If true, the texture and extension part will be destroyed. You will have to pass another parent next time Grid.Instance is called.
     */
    public Reset(forgetParent = false): void {
        this.GridTexture.Transparency = this.OriginalGridTransparency;

        if (forgetParent) {
            GridOld.ParentGridPart = undefined;
            this.ExtensionPart.Destroy();
            this.GridTexture.Destroy();
        }

        this.Connections.ForEach((Connection) => Connection.Disconnect());

        GridOld._instance = undefined;
    }

    private Rotate(rotation: number = 90): void {
        GridOld.Rotation += rotation;
        if (GridOld.Rotation >= 360){
            GridOld.Rotation -= 360;
        }

        if (this.IsPlaceButtonDown()) return;
    
        const ItemSizeCells = this.GetItemSizeInCellsXY();
        const [CellSkip, CellOffset] = this.GetCellSkipAndCellOffset();

        this.ItemSizeCells = ItemSizeCells;
        this.CellSkip = CellSkip;
        this.CellOffset = CellOffset;

        this.Events.OnRotate.Fire(GridOld.Rotation);
        
        this.FireCast();
    }

    /**
     * Set custom cast behavior for placement -- this is generally not needed.
     * @param CastBehavior 
     */
    public SetCastBehavior(CastBehavior: FastCastBehavior): this {
        this.CastBehavior = CastBehavior;
        return this;
    }

    /**
     * Set the velocity of the cast behavior.
     * @param CastVelocity 
     * @default 1000
     */
    public SetCastVelocity(CastVelocity: number): this {
        this.CastVelocity = CastVelocity;
        return this;
    }

    public SetCellSize(cellSize: number, resizeParent: boolean = false): this {
        this.GridTexture.StudsPerTileU = cellSize;
        this.GridTexture.StudsPerTileV = cellSize;

        if(!resizeParent) return this;

        const Parent = GridOld.ParentGridPart!;

        // Resize the parent part if needed to not have partial cells.
        const x = (Parent.Size.X % cellSize) * cellSize;
        const y = Parent.Size.Y;
        const z = (Parent.Size.Z % cellSize) * cellSize;

        const OGCFrame = Parent.CFrame;

        Parent.Size = new Vector3(x, y, z);
        Parent.CFrame = OGCFrame;

        return this;
    }

    /**
     * The signals used to initiate a raycast for item placement. Default e.g.: mouse move.
     * @param FireSignal The signal to use for firing the callback.
     */
    public SetFireSignals(...FireSignals: FireSignal[]): this {
        for (const Signal of FireSignals) {
            this.FireSignals.Set(Signal.Name, Signal);
        }

        return this;
    }

    public SetGridSize(widthInCells: number, heightInCells: number): this {
        const Parent = GridOld.ParentGridPart!;

        //It doesn't matter if use perTileU or V since the grid is square.
        const x = widthInCells * this.GridTexture.StudsPerTileU;
        const y = Parent.Size.Y;
        const z = heightInCells * this.GridTexture.StudsPerTileU;

        Parent.Size = new Vector3(x, y, z);

        return this;
    }

    /**
     * How many "sub" cells items will snap to.
     * 
     * The result is 1 / 2^N. Ex: Snapsize 1 = 1/2 cells.
     * 
     * This will break placement overlap checks
     * @param SnapSize
     * @default 0
     * @min 0
     * @deprecated
     */
    public SetSnapSize(SnapSize: number): this {
        if (SnapSize < 0) SnapSize = 0;
        this.SnapSize = SnapSize;
        return this;
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

        return this;
    }

    public ToggleGrid(on?: boolean): this {
        if(on === undefined) {
            on = this.GridTexture.Transparency === this.OriginalGridTransparency;
        }

        this.GridTexture.Transparency = on ? this.OriginalGridTransparency : 1;

        return this;
    }

    public UpdateCastFilter(): this {
        if (!GridOld.ParentGridPart || !this.CastBehavior.RaycastParams) return this;
        this.CastBehavior.RaycastParams.FilterDescendantsInstances = [
            GridOld.ParentGridPart!
        ];

        return this;
    }
}

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

class OnDrag {
    public Added: boolean;
    public CF: CFrame[];

    public constructor(Added: boolean, CF: CFrame[]) {
        this.Added = Added;
        this.CF = CF;
    }
}

class OnMove {
    public ItemId: number;
    public Pos: Vector3;
    public Rot: Vector3;

    public constructor(ItemId: number, Pos: Vector3, Rot: Vector3) {
        this.ItemId = ItemId;
        this.Pos = Pos;
        this.Rot = Rot;
    }
}

class OnPlace {
    public ItemId: number;
    public CF: CFrame[];

    public constructor(ItemId: number, CF: CFrame[]) {
        this.ItemId = ItemId;
        this.CF = CF;
    }
}