import { LinkedList } from "shared/modules/LinkedList/LinkedList";
import { BaseGrid } from "./BaseGrid";
import { Collection } from "shared/modules/Collection/Collection";
import { Input } from "../Input/Input";
import { Plot } from "../Plot/Plot";

// TODO: When hovering on half cells, the final horizontal item is not rotated properly.
// TODO: Track the last anchor and fix the rotation of that item when needed.

class AnchorData {
    public DragStart: Vector3;
    public SaveItems: Collection<string, CFrame>;
    public Icon: Part | undefined;

    public constructor(DragStart: Vector3, SaveItems: Collection<string, CFrame>, Icon?: Part) {
        this.DragStart = DragStart;
        this.SaveItems = SaveItems;
        this.Icon = Icon;
    }
}

export class AnchorDragGrid extends BaseGrid {
    // Additional properties specific to AnchorDragGrid
    private AnchorLink: LinkedList<AnchorData> = new LinkedList();
    private AnchorIndexes: ICollection<string, number> = new Collection();
    private MaxAnchors = 6;
    private PendingAnchor = false;

    constructor(PState: { ParentGridPart: Part; Rotation: number }) {
        super(PState);

        this.Connections.Set("place_anchor", Input.Controls.KeyboardMouse.GridAnchor.OnDown(
            "sq_grid_anchor", 
            () => this.PlaceAnchor())
        );

        Input.Controls.KeyboardMouse.GridItemPlace.SetConditionalIgnoreGuiFunc(G => {
            return G.IsDescendantOf(Plot.AnchorFolder);
        });
    }

    public override CleanUp(): void {
        super.CleanUp();
        this.AnchorLink.Clear();
        this.AnchorIndexes.Clear();

        this.DestroyAnchors();
    }

    private DestroyAnchors(): void {
        Plot.AnchorFolder.GetChildren().forEach((Child) => {
            if (Child.Name === "Template") return;
            Child.Destroy();
        });
        _G.Log("Destroyed all anchors", "AnchorDragGrid");
    }

    private DestroyAnchorsWithIndex(Index: number): void {
        Plot.AnchorFolder.GetChildren().forEach((Child) => {
            if (Child.Name === "Template") return;
            const Idx = tonumber(Child.Name);
            if (Idx === undefined) return;

            if (Index <= Idx) Child.Destroy();
        });
        _G.Log("Destroyed anchors with index " + Index, "AnchorDragGrid");
    }

    private GenerateLShapeOrLineItems(Start: Vector2, End: Vector2): void {
        _G.Log("Generating L shape or line items", "AnchorDragGrid");
        const MinX = math.min(Start.X, End.X);
        const MaxX = math.max(Start.X, End.X);
        const MinY = math.min(Start.Y, End.Y);
        const MaxY = math.max(Start.Y, End.Y);
    
        const ItemSize = this.GetItemSizeInCellsXY();
        const StepX = ItemSize.X * this.GridTexture.StudsPerTileU;
        const StepY = ItemSize.Y * this.GridTexture.StudsPerTileV;

        // If the start and end are within half a cell return (single placement)
        if (math.abs(Start.X - End.X) <= StepX / 2 && math.abs(Start.Y - End.Y) <= StepY / 2) {
            return;
        }
    
        // Determine the drag direction
        const isDraggingLeft = Start.X > End.X;
        const isDraggingUp = Start.Y > End.Y;

        let VertXAlign;
        let LastCF: CFrame | undefined;

        const Connection = this.Drag.Events.OnAdd.Connect(({Key, Value}) => LastCF = Value);
    
        // Handle horizontal line first
        if (isDraggingLeft) {
            for (let x = MaxX; x >= MinX; x -= StepX) {
                const Position = new Vector3(x, this.LastTargetCFrame.Position.Y, isDraggingUp ? MaxY : MinY);
                // Check if this is the final item in the horizontal loop
                if (x === MinX || x - StepX < MinX) {
                    // Final horizontal item, rotate it upwards or downwards
                    const FinalCF = new CFrame(Position).mul(CFrame.Angles(0, math.rad(isDraggingUp ? 0 : 180), 0));
                    VertXAlign = FinalCF.Position.X;
                    this.Drag.Set(FinalCF.Position.X + "," + FinalCF.Position.Z, FinalCF);
                } else {
                    // Regular horizontal item, rotate along the drag direction
                    const CF = new CFrame(Position).mul(CFrame.Angles(0, math.rad(90), 0));
                    VertXAlign = CF.Position.X;
                    this.Drag.Set(CF.Position.X + "," + CF.Position.Z, CF);
                }
            }
        } else {
            for (let x = MinX; x <= MaxX; x += StepX) {
                const Position = new Vector3(x, this.LastTargetCFrame.Position.Y, isDraggingUp ? MaxY : MinY);
                // Check if this is the final item in the horizontal loop
                if (x === MaxX || x + StepX > MaxX) {
                    // Final horizontal item, rotate it upwards or downwards
                    const FinalCF = new CFrame(Position).mul(CFrame.Angles(0, math.rad(isDraggingUp ? 0 : 180), 0));
                    VertXAlign = FinalCF.Position.X;
                    this.Drag.Set(FinalCF.Position.X + "," + FinalCF.Position.Z, FinalCF);
                } else {
                    // Regular horizontal item, rotate along the drag direction
                    const CF = new CFrame(Position).mul(CFrame.Angles(0, math.rad(-90), 0));
                    VertXAlign = CF.Position.X;
                    this.Drag.Set(CF.Position.X + "," + CF.Position.Z, CF);
                }
            }
        }
    
        // Handle vertical line after the horizontal line is placed
        if (isDraggingUp) {
            for (let y = MaxY - StepY; y >= MinY; y -= StepY) { // Start from MaxY - StepY to avoid duplicating the corner
                const x = VertXAlign; //(isDraggingLeft ? MinX : MaxX); 
                const Position = new Vector3(x, this.LastTargetCFrame.Position.Y, y);
                const CF = new CFrame(Position).mul(CFrame.Angles(0, math.rad(0), 0));
                this.Drag.Set(CF.Position.X + "," + CF.Position.Z, CF);
            }
        } else {
            for (let y = MinY + StepY; y <= MaxY; y += StepY) { // Start from MinY + StepY to avoid duplicating the corner
                const x = VertXAlign; //(isDraggingLeft ? MinX : MaxX);
                const Position = new Vector3(x, this.LastTargetCFrame.Position.Y, y);
                const CF = new CFrame(Position).mul(CFrame.Angles(0, math.rad(180), 0));
                this.Drag.Set(CF.Position.X + "," + CF.Position.Z, CF);
            }
        }

        Connection.Disconnect();
        if (!this.PendingAnchor || LastCF === undefined) return;

        const Last = LastCF;
        const Key = Last.Position.X + "," + Last.Position.Z;

        if (this.AnchorIndexes.Has(Key)) {
            //print("Removing anchor at " + Key);
            const Index = this.AnchorIndexes.Get(Key)!;

            if (Index === 0) {
                this.PendingAnchor = false;
                return;
            }
            
            this.AnchorLink.Slice(Index);
            this.AnchorIndexes = this.AnchorIndexes.Filter((i) => i < Index);
            this.PendingAnchor = false;

            const LastLink = this.AnchorLink.GetTail();
            //print(LastLink?.DragStart);
            if (LastLink === undefined) {
                this.DestroyAnchors();
                this.DragStart = undefined;
                return;
            }

            //print(this.AnchorLink.GetSize(), this.AnchorIndexes.Size());
            this.DestroyAnchorsWithIndex(Index);
            this.DragStart = LastLink.DragStart;
            return;
        }

        if (this.AnchorIndexes.Size() >= this.MaxAnchors) {
            print("Max anchors reached");
            this.PendingAnchor = false;
            return;
        }

        const Save = new Collection<string, CFrame>();
        this.Drag.ForEach((CF, Key) => {
            Save.Set(Key, CF);
        });

        const Clone = Plot.AnchorFolder.Template.Clone();
        Clone.Position = Last.Position;
        Clone.Parent = Plot.AnchorFolder;
        Clone.SurfaceGui.Enabled = true;
        Clone.Name = this.AnchorIndexes.Size() + "";

        this.AnchorLink.Add(new AnchorData(Last.Position, Save, Clone));

        this.AnchorIndexes.Set(Key, this.AnchorIndexes.Size());
        this.DragStart = Last.Position;
        this.PendingAnchor = false;
    }

    private MergeAnchors(): void {
        this.AnchorLink.ForEach((Link) => {
            Link.SaveItems.ForEach((CF, Key) => {
                this.Drag.Set(Key, CF);
            });
        });
        _G.Log("Merged anchors", "AnchorDragGrid");
    }
    

    protected override OnRayHit(c: ActiveCast, res: RaycastResult, v: Vector3, b: Instance): void {
        super.OnRayHit(c, res, v, b);
    
        const LastPos = this.LastTargetCFrame;
        const IsDown = this.IsPlaceButtonDown();
        if (!IsDown) {
            this.DragStart = undefined;
            return;
        }

        if (this.DragStart === undefined) {
            this.DragStart = LastPos.Position;
            this.AnchorLink.Add(new AnchorData(LastPos.Position, new Collection()));
            this.AnchorIndexes.Set(this.DragStart.X + "," + this.DragStart.Z, this.AnchorIndexes.Size());
        }

        // Place items in a an "L" shape or straigt line from dragStart to lastPos.
        // Rotate the item towards depending on the direction where right is 90, down is 180, and left is 270.
        const Start = new Vector2(this.DragStart.X, this.DragStart.Z);
        const End = new Vector2(LastPos.Position.X, LastPos.Position.Z);
        this.Drag.Clear();
        this.GenerateLShapeOrLineItems(Start, End);
        this.MergeAnchors();
    }
    
    protected override Place(): void {
        super.Place();
        this.AnchorLink.Clear();
        this.AnchorIndexes.Clear();
        this.DragStart = undefined;
        this.PendingAnchor = false;
        this.DestroyAnchors();
    }
    
    private PlaceAnchor(): void {
        if (!this.IsPlaceButtonDown()) return;
        this.PendingAnchor = true;
        _G.Log("Placing anchor", "AnchorDragGrid");
    }
}
