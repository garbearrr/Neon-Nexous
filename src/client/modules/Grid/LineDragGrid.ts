import { BaseGrid } from "./BaseGrid";

export class LineDragGrid extends BaseGrid {
    private LineDirection: "Horizontal" | "Vertical" | undefined = undefined;

    constructor(PState: { ParentGridPart: Part; Rotation: number }) {
        super(PState);
    }

    /**
     * Generates line items from Start to End in a specified direction.
     * @param Start The starting cell position.
     * @param End The ending cell position.
     */
    private GenerateLineItems(Start: Vector2, End: Vector2): void {
        if (this.LineDirection === undefined) return;

        const ItemSize = this.GetItemSizeInCellsXY();
        const CellSizeU = this.GridTexture.StudsPerTileU;
        const CellSizeV = this.GridTexture.StudsPerTileV;

        let Min: number;
        let Max: number;
        let fixedValue: number;

        if (this.LineDirection === "Horizontal") {
            Min = math.min(Start.X, End.X);
            Max = math.max(Start.X, End.X);
            fixedValue = Start.Y;
        } else /* Vertical */ {
            Min = math.min(Start.Y, End.Y);
            Max = math.max(Start.Y, End.Y);
            fixedValue = Start.X;
        }

        const Step = this.LineDirection === "Horizontal" ? ItemSize.X : ItemSize.Y;
        const StepSize = this.LineDirection === "Horizontal" ? CellSizeU : CellSizeV;
        const numItems = math.floor((Max - Min) / (Step * StepSize)) + 1;

        for (let i = 0; i < numItems; i++) {
            const position = this.LineDirection === "Horizontal"
                ? new Vector2(Min + i * Step * StepSize, fixedValue)
                : new Vector2(fixedValue, Min + i * Step * StepSize);

            const worldPos = new Vector3(position.X, this.LastTargetCFrame.Position.Y, position.Y);
            const cf = new CFrame(worldPos).mul(
                CFrame.Angles(0, math.rad(this.PState.Rotation), 0)
            );

            this.Drag.SetAdd(`${cf.Position.X},${cf.Position.Z}`, cf);
        }
    }

    protected override OnRayHit(c: ActiveCast, res: RaycastResult, v: Vector3, b: Instance): void {
        super.OnRayHit(c, res, v, b);

        const LastPos = this.LastTargetCFrame;
        const IsDown = this.IsPlaceButtonDown();

        if (!IsDown) {
            this.DragStart = undefined;
            this.LineDirection = undefined;
            return;
        }

        if (this.DragStart === undefined) {
            this.DragStart = LastPos.Position;
            return;
        }

        const currentPos = LastPos.Position;
        const startCell = new Vector2(this.DragStart.X, this.DragStart.Z);
        const currentCell = new Vector2(currentPos.X, currentPos.Z);

        const delta = currentCell.sub(startCell);
        if (math.abs(delta.X) > math.abs(delta.Y)) {
            this.LineDirection = "Horizontal";
        } else {
            this.LineDirection = "Vertical";
        }

        // Clear previous drag items
        this.Drag.Clear();

        // Generate new line items based on the determined direction
        this.GenerateLineItems(startCell, currentCell);
    }

    protected override Place(): void {
        super.Place();
        this.DragStart = undefined;
        this.LineDirection = undefined;
    }
}
