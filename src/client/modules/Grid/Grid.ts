import { AnchorDragGrid } from "./AnchorDragGrid";
import { ContextualDragGrid } from "./ContextualDragGrid";
import { LineDragGrid } from "./LineDragGrid";
import { SquareDragGrid } from "./SquareDragGrid";

export interface BuildModes {
    "AnchorDragGrid": AnchorDragGrid;
    "ContextualDragGrid": ContextualDragGrid;
    "LineDragGrid": LineDragGrid;
    "SquareDragGrid": SquareDragGrid;
}

interface PState {
    ParentGridPart?: Part;
    Rotation: number;
}

interface DefinedPState {
    ParentGridPart: Part;
    Rotation: number;
}

export namespace Grid {
    // Persistent State
    const PState: PState = {
        ParentGridPart: undefined,
        Rotation: 0,
    }

    let _Instance: BuildModes[keyof BuildModes] | undefined;

    export const GetGlobalInstance = (GridParent?: Part): BuildModes[keyof BuildModes] => {
        if (_Instance === undefined) {
            if (GridParent === undefined && PState.ParentGridPart === undefined) {
                throw "GridParent is required for the first instance!";
            }

            PState.ParentGridPart = GridParent || PState.ParentGridPart!;

            _Instance = new AnchorDragGrid(PState as DefinedPState);
        }

        return _Instance;
    }

    export const Instance = <T extends keyof BuildModes>(Which: T, GridParent: Part): BuildModes[T] => {
        if (_Instance !== undefined) {
            _Instance.CleanUp();
            _Instance = undefined;
        }

        PState.ParentGridPart = GridParent;

        switch (Which) {
            case "AnchorDragGrid":
                _Instance = new AnchorDragGrid(PState as DefinedPState);
                break;
            case "ContextualDragGrid":
                _Instance = new ContextualDragGrid(PState as DefinedPState, []);
                break;
            case "LineDragGrid":
                _Instance = new LineDragGrid(PState as DefinedPState);
                break;
            case "SquareDragGrid":
                _Instance = new SquareDragGrid(PState as DefinedPState);
                break;
            default:
                throw "Invalid Grid type!";
        }

        // Cast to the correct type for the specific grid
        return _Instance as BuildModes[T];
    }
}