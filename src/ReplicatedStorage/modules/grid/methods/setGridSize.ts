import { GridState } from "../types";

export const setGridSize = (State: GridState, widthInCells: number, heightInCells: number): void => {
    //It doesn't matter if use perTileU or V since the grid is square.
    const x = widthInCells * State.GridTexture.StudsPerTileU;
    const y = State.ParentGridPart.Size.Y;
    const z = heightInCells * State.GridTexture.StudsPerTileU;
    State.ParentGridPart.Size = new Vector3(x, y, z);
}