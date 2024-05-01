import { BaseModule } from "@rbxgar/basemodule"
import { ReturnTypeBasedOnKey } from "../../../../types/util";


interface GridMethods {
    /**
     * General get method
     */
    Get: <K extends keyof GridState>(key: K) => Readonly<ReturnTypeBasedOnKey<GridState, K>>;
    /**
     * Resizes grid cells and resizes the parent part if specified.
     */
    SetCellSize: (cellSize: number, resizeParent?: boolean) => void
    /**
     * Sets the grid size in cells.
     */
    SetGridSize: (widthInCells: number, heightInCells: number) => void,
    /**
     * Toggles grid visibility.
     */
    ToggleGrid: (on?: boolean) => void,
}

interface GridOptions {
    GridTexture?: Texture
    ExtensionPart?: Part
}

interface GridState {
    /**
     * This is a larger, invisible part that will be used so that targets outside of the grid can be hit.
     */
    ExtensionPart: Part
    /**
     * The texture of the grid on the parent part.
     */
    GridTexture: Texture
    IsDestroyed: boolean
    /**
     * Original grid transparency. Used for resetting state of grid.
     */
    OriginalGridTransparency: number;
    /**
     * The part that the grid will be built on.
     */
    ParentGridPart: Part
}

type GridModule = BaseModule & GridMethods