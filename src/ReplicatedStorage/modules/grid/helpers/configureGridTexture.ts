import { GridC } from "../constants";
import { GridState } from "../types";

export const configureGridTexture = (ParentPart: GridState["ParentGridPart"]) => {
    const Lookup = ParentPart.FindFirstChild(GridC.GRID_TEXTURE_NAME);
    if (Lookup) return Lookup as Texture;
    
    const Texture = new Instance("Texture");
    Texture.Transparency    = 0;
    Texture.Color3          = new Color3(0, 0, 1);
    Texture.StudsPerTileU   = 6;
    Texture.StudsPerTileV   = 6;
    Texture.Face            = Enum.NormalId.Top;
    Texture.Texture         = GridC.GRID_TEXTURE_URL;
    Texture.Parent          = ParentPart;
    Texture.Name            = GridC.GRID_TEXTURE_NAME;

    return Texture;
}