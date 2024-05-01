import { moduleGet } from "ReplicatedStorage/util/moduleGet";
import { configureExtensionPart } from "./helpers/configureExtensionPart";
import { configureGridTexture } from "./helpers/configureGridTexture";
import { setCellSize, setGridSize, toggleGrid } from "./methods";
import { GridMethods, GridModule, GridOptions, GridState } from "./types";
import { DeclareModule } from "@rbxgar/basemodule";

export function Grid(GridParentPart: GridState["ParentGridPart"], opts?: GridOptions): GridModule {
    const GridTexture = opts?.GridTexture || configureGridTexture(GridParentPart);

    const State: GridState = {
        ExtensionPart:              opts?.ExtensionPart || configureExtensionPart(GridParentPart),
        GridTexture:                GridTexture,
        IsDestroyed:                false,
        OriginalGridTransparency:   GridTexture.Transparency,
        ParentGridPart:             GridParentPart
    }

    const Methods = (State: GridState): GridMethods => ({
        Get: moduleGet(State),
        SetCellSize: (cellSize: number, resizeParent?: boolean) => setCellSize(State, cellSize, resizeParent),
        SetGridSize: (widthInCells: number, heightInCells: number) => setGridSize(State, widthInCells, heightInCells),
        ToggleGrid: (on?: boolean) => toggleGrid(State, on)
    });

    const IsDestroyed = () => State.IsDestroyed;
    
    const Mod = { ...Methods(State), IsDestroyed};

    const Destroy = () => {
        State.GridTexture.Transparency = State.OriginalGridTransparency;

        for (const [Key] of pairs(Mod)) {
            if (Key === "IsDestroyed") continue;
            delete Mod[Key as keyof GridMethods];
        }

        for (const [Key] of pairs(State)) {
            if (Key === "IsDestroyed") continue;
            delete State[Key as keyof GridState];
        }
    }

    return DeclareModule({...Mod, Destroy});
}