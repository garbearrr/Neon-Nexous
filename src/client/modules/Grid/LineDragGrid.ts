import { BaseGrid } from "./BaseGrid";

export class LineDragGrid extends BaseGrid {

    constructor(PState: { ParentGridPart: Part; Rotation: number }) {
        super(PState);
    }

    public override CleanUp(): void {
        super.CleanUp();
        this.DragStart = undefined;
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
        }

        // Clear previous drag data
        this.Drag.Clear();
        // Generate items along the line from DragStart to LastPos.Position
        this.GenerateAxisAlignedLineItems(this.DragStart, LastPos.Position);
    }

    private WorldPositionToGridIndex(Position: Vector3): Vector2 {
        const GridCellSizeX = this.GridTexture.StudsPerTileU * this.GetItemSizeInCellsXY().X;
        const GridCellSizeZ = this.GridTexture.StudsPerTileV * this.GetItemSizeInCellsXY().Y;
        const OriginX = this.PState.ParentGridPart.Position.X;
        const OriginZ = this.PState.ParentGridPart.Position.Z;
        return new Vector2(
            math.floor((Position.X - OriginX) / GridCellSizeX + 0.5),
            math.floor((Position.Z - OriginZ) / GridCellSizeZ + 0.5)
        );
    }

    private GridIndexToWorldPosition(Index: Vector2): Vector3 {
        const GridCellSizeX = this.GridTexture.StudsPerTileU * this.GetItemSizeInCellsXY().X;
        const GridCellSizeZ = this.GridTexture.StudsPerTileV * this.GetItemSizeInCellsXY().Y;
        const OriginX = this.PState.ParentGridPart.Position.X;
        const OriginZ = this.PState.ParentGridPart.Position.Z;
        return new Vector3(
            OriginX + Index.X * GridCellSizeX,
            this.LastTargetCFrame.Position.Y,
            OriginZ + Index.Y * GridCellSizeZ
        );
    }

    private GenerateAxisAlignedLineItems(StartPosition: Vector3, EndPosition: Vector3): void {
        const StartIndex = this.WorldPositionToGridIndex(StartPosition);
        const EndIndex = this.WorldPositionToGridIndex(EndPosition);

        const dx = math.abs(EndIndex.X - StartIndex.X);
        const dy = math.abs(EndIndex.Y - StartIndex.Y);

        // Determine the primary direction (horizontal or vertical)
        if (dx >= dy) {
            // Horizontal line
            const step = EndIndex.X >= StartIndex.X ? 1 : -1;
            for (let x = StartIndex.X; x !== EndIndex.X + step; x += step) {
                const Position = this.GridIndexToWorldPosition(new Vector2(x, StartIndex.Y));
                const CF = new CFrame(Position);
                const Key = CF.Position.X + "," + CF.Position.Z;
                this.Drag.SetAdd(Key, CF);
            }
        } else {
            // Vertical line
            const step = EndIndex.Y >= StartIndex.Y ? 1 : -1;
            for (let y = StartIndex.Y; y !== EndIndex.Y + step; y += step) {
                const Position = this.GridIndexToWorldPosition(new Vector2(StartIndex.X, y));
                const CF = new CFrame(Position);
                const Key = CF.Position.X + "," + CF.Position.Z;
                this.Drag.SetAdd(Key, CF);
            }
        }
    }

    protected override Place(): void {
        super.Place();
        this.DragStart = undefined;
    }
}
