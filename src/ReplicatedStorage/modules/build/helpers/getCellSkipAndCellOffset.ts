import { Build } from "../build";

export const getCellSkipAndCellOffset = (ItemSizeInCells: Vector2, GridTexture: Texture): [Vector2, Vector2] => {
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