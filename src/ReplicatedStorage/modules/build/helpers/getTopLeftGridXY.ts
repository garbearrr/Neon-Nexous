import { GridState } from "ReplicatedStorage/modules/grid/types";

export const getTopLeftGridXY = (GridParentPart: GridState["ParentGridPart"]): Vector2 => {
    const topLeftGridX = math.floor(GridParentPart.Position.X * 100) / 100 - GridParentPart.Size.X / 2;
    const topLeftGridY = math.floor(GridParentPart.Position.Z * 100) / 100 - GridParentPart.Size.Z / 2;

    return new Vector2(topLeftGridX, topLeftGridY);
}