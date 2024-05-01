import { GridC } from "ReplicatedStorage/modules/grid/constants";
import { GridState } from "../types";


export const configureExtensionPart = (ParentPart: GridState["ParentGridPart"]) => {
    const Lookup = ParentPart.FindFirstChild(GridC.EXTENSION_PART_NAME);
    if (Lookup) return Lookup as Part;
    
    const Extension = new Instance("Part");
    Extension.Transparency  = 1;
    Extension.Name          = GridC.EXTENSION_PART_NAME;
    Extension.Parent        = ParentPart;
    Extension.CFrame        = ParentPart.CFrame;
    Extension.Size          = new Vector3(1000, ParentPart.Size.Y - 0.001, 1000);
    Extension.CanCollide    = false;
    Extension.CanTouch      = false;
    Extension.Anchored      = true;

    return Extension;
}