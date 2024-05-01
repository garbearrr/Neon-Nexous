import { GridState } from "ReplicatedStorage/modules/grid/types";

export const getGridSizeXY = (GridParentPart: GridState["ParentGridPart"], GridTexture: Texture): Vector2 => {
    const gridSizeX = math.round(GridParentPart.Size.X / GridTexture.StudsPerTileU);
    const gridSizeY = math.round(GridParentPart.Size.Z / GridTexture.StudsPerTileV);

    return new Vector2(gridSizeX, gridSizeY);
}