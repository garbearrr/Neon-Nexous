import { ActiveCast } from "@rbxgar/fastcast";
import { BuildEvents, BuildState } from "../types";
import { getGridSizeXY } from "./getGridSizeXY";
import { GridModule } from "ReplicatedStorage/modules/grid/types";
import { getTopLeftGridXY } from "./getTopLeftGridXY";

const findClosestFraction = (decimal: number, pow: number, size: number) => {
    if (pow === 0 && size % 2 === 1) return 0.5;

    const powerOfTwo = math.pow(2, pow);  // Calculate 2^n
    const scaledValue = decimal * powerOfTwo;  // Scale the value to the range [0, 2^n]
    const closestIndex = math.round(scaledValue);  // Find the nearest whole number
    const closestFraction = closestIndex / powerOfTwo;  // Scale back to [0, 1]
    return closestFraction;
}

export const onRayHit = (
    State: BuildState,
    Grid: GridModule,
    OnMove: BuildEvents["OnMove"],
    OnDrag: BuildEvents["OnDrag"],
    rot: number,
    _c: ActiveCast,
    result: RaycastResult,
    _v: Vector3, _b: Instance,
) => {
    const GridParent = Grid.Get("ParentGridPart");
    const GridTexture = Grid.Get("GridTexture");

    const GridSizeCells = getGridSizeXY(GridParent, GridTexture);
    const TopLeftGrid = getTopLeftGridXY(GridParent);

    const CellSizeX = GridTexture.StudsPerTileU;
    const CellSizeY = GridTexture.StudsPerTileV;

    const Target = result.Position;

    // Clamping area to grid and possibly if there are cells to skip around the outside.
    const ClampedTarget = new Vector3(
        math.clamp(
            Target.X,
            TopLeftGrid.X                               + State.CellSkip.X * CellSizeX + State.CellOffset.X,
            TopLeftGrid.X + GridSizeCells.X * CellSizeX - State.CellSkip.X * CellSizeX - State.CellOffset.X
        ),
        GridParent.Position.Y + GridParent.Size.Y / 2 + State.ItemSize.Y / 2,
        math.clamp(
            Target.Z, 
            TopLeftGrid.Y                               + State.CellSkip.Y * CellSizeY + State.CellOffset.Y, 
            TopLeftGrid.Y + GridSizeCells.Y * CellSizeY - State.CellSkip.Y * CellSizeY - State.CellOffset.Y,
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

    const ItemSizeCells = State.ItemSizeCells;

    const SnappedDecimal = new Vector2(
        findClosestFraction(NoWholeNumber.X, State.SnapSize, ItemSizeCells.X),
        findClosestFraction(NoWholeNumber.Y, State.SnapSize, ItemSizeCells.Y)
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

    const TargetOrientation = new Vector3(0, math.rad(rot), 0);

    State.LastTargetCFrame = new CFrame(TargetPosition).mul(
        CFrame.Angles(0, TargetOrientation.Y, 0)
    );

    OnMove.Fire({
        ItemId: State.ItemId,
        Pos: TargetPosition,
        Rot: TargetOrientation
    });

    if (State.PlaceInputDown && State.DragStart === undefined) {
        State.DragStart = new Vector2(TargetPosition.X, TargetPosition.Z);
        return;
    }

    if (!State.PlaceInputDown) return;
    
    const CellsAwayFromDragStart = new Vector2(
        (TargetPosition.X - State.DragStart!.X) / CellSizeX,
        (State.DragStart!.Y - TargetPosition.Z) / CellSizeY
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
        !State.DragLockedVertical ? math.floor(IncreaseBy.X) : 0,
        !State.DragLockedHorizontal ? math.floor(IncreaseBy.Y * -1) : 0
    );

    const AbsIncreaseBy = new Vector2(
        math.abs(FlooredIncreaseBy.X),
        math.abs(FlooredIncreaseBy.Y)
    );

    const NewDragCache: CFrame[] = [];
    const StartCF = new CFrame(State.DragStart!.X, TargetPosition.Y, State.DragStart!.Y).mul(CFrame.Angles(0, TargetOrientation.Y, 0));
    NewDragCache.push(StartCF);

    for (let y = 0; y < AbsIncreaseBy.Y + 1; y++) {

        for (let x = 1; x < AbsIncreaseBy.X + 1; x++) {
            const Pos = new Vector3(
                State.DragStart!.X + x * ItemSizeCells.X * CellSizeX * (FlooredIncreaseBy.X < 0 ? -1 : 1),
                TargetPosition.Y,
                State.DragStart!.Y + y * ItemSizeCells.Y * CellSizeY * (FlooredIncreaseBy.Y < 0 ? -1 : 1)
            );

            const CF = new CFrame(Pos).mul(
                CFrame.Angles(0, TargetOrientation.Y, 0)
            );

            NewDragCache.push(CF);
        }

        if (y === 0) continue;

        const Pos = new Vector3(
            State.DragStart!.X,
            TargetPosition.Y,
            State.DragStart!.Y + y * ItemSizeCells.Y * CellSizeY * (FlooredIncreaseBy.Y < 0 ? -1 : 1)
        );

        const CF = new CFrame(Pos).mul(
            CFrame.Angles(0, TargetOrientation.Y, 0)
        );

        NewDragCache.push(CF);
    }
    if (NewDragCache.size() === State.Drag.size()) return;

    if (State.Drag.size() > NewDragCache.size()) {
        const Removed = State.Drag.filter((CF) => {
            return !NewDragCache.some((Pos) => {
                return Pos.Position === CF.Position;
            });
        });

        State.Drag = NewDragCache;

        OnDrag.Fire({
            Added: false,
            CF: Removed
        });
    } else {
        const Added = NewDragCache.filter((CF) => {
            return !State.Drag.some((Pos) => {
                return Pos.Position === CF.Position;
            });
        });

        State.Drag = NewDragCache;

        OnDrag.Fire({
            Added: true,
            CF: Added
        });
    }
}