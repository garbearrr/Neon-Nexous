import { BaseGrid } from "./BaseGrid";

export class SquareDragGrid extends BaseGrid {
    constructor(PState: { ParentGridPart: Part; Rotation: number }) {
        super(PState);
    }

    private GenerateSquareItems(Start: Vector2, End: Vector2): void {
        const MinX = math.min(Start.X, End.X);
        const MaxX = math.max(Start.X, End.X);
        const MinY = math.min(Start.Y, End.Y);
        const MaxY = math.max(Start.Y, End.Y);
    
        const ItemSize = this.GetItemSizeInCellsXY();
        const StepX = ItemSize.X * this.GridTexture.StudsPerTileU;
        const StepY = ItemSize.Y * this.GridTexture.StudsPerTileV;
    
        for (let x = MinX; x <= MaxX; x += StepX) {
            for (let y = MinY; y <= MaxY; y += StepY) {
                const Position = new Vector3(x, this.LastTargetCFrame.Position.Y, y);
                const CF = new CFrame(Position).mul(
                    CFrame.Angles(0, math.rad(this.PState.Rotation), 0)
                );
    
                this.Drag.Set(CF.Position.X + "," + CF.Position.Z, CF);
            }
        }
    }
    
    protected OnRayHit(c: ActiveCast, res: RaycastResult, v: Vector3, b: Instance): void {
        super.OnRayHit(c, res, v, b);
    
        const LastPos = this.LastTargetCFrame;
        const IsDown = this.IsPlaceButtonDown();
        if (!IsDown) {
            this.DragStart = undefined;
            return;
        }

        if (this.DragStart === undefined) {
            this.DragStart = LastPos.Position;
        }

        // From dragStart to lastPos add the items in a square to this.Drag collection
        const Start = new Vector2(this.DragStart.X, this.DragStart.Z);
        const End = new Vector2(LastPos.Position.X, LastPos.Position.Z);
        this.Drag.Clear();
        this.GenerateSquareItems(Start, End);
    }
    
    protected override Place(): void {
        super.Place();
        this.DragStart = undefined;
    }
    
    /* private PlaceAnchor(): void {
        this.DragStart = this.LastTargetCFrame.Position;
    } */
}
