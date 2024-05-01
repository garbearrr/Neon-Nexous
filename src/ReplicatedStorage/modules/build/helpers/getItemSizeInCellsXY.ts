export const getItemSizeInCellsXY = (rotation: number, ItemSize: Vector3, GridTexture: Texture): Vector2 => {
    const shouldflip = rotation / 90 === 1 || rotation / 90 === 3;

    const ObjectSizeX = shouldflip ? ItemSize.Z / GridTexture.StudsPerTileV : ItemSize.X / GridTexture.StudsPerTileU;
    const ObjectSizeY = shouldflip ? ItemSize.X / GridTexture.StudsPerTileU : ItemSize.Z / GridTexture.StudsPerTileV;

    return new Vector2(ObjectSizeX, ObjectSizeY);
}