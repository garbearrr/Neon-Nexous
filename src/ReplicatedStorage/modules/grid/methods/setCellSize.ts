import { GridState } from "../types";

export const setCellSize = (State: GridState, cellSize: number, resizeParent=false): void => {
    State.GridTexture.StudsPerTileU = cellSize;
    State.GridTexture.StudsPerTileV = cellSize;

    if(!resizeParent) return;

    // Resize the parent part if needed to not have partial cells.
    const x = (State.ParentGridPart.Size.X % cellSize) * cellSize;
    const y = State.ParentGridPart.Size.Y;
    const z = (State.ParentGridPart.Size.Z % cellSize) * cellSize;

    const OGCFrame = State.ParentGridPart.CFrame;

    State.ParentGridPart.Size = new Vector3(x, y, z);
    State.ParentGridPart.CFrame = OGCFrame;
}