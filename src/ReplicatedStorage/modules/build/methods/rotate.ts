import { GridState } from "ReplicatedStorage/modules/grid/types";
import { fireCast, getCellSkipAndCellOffset, getItemSizeInCellsXY } from "../helpers";
import { BuildEvents, BuildState } from "../types";
import { Players } from "@rbxts/services";

export const rotate = (State: BuildState, GridTexture: GridState["GridTexture"], rot: number, velo: number) => {
    if (State.PlaceInputDown) return;
    
    const ItemSizeCells = getItemSizeInCellsXY(rot, State.ItemSize, GridTexture);
    const [CellSkip, CellOffset] = getCellSkipAndCellOffset(ItemSizeCells, GridTexture);

    State.ItemSizeCells = ItemSizeCells;
    State.CellSkip = CellSkip;
    State.CellOffset = CellOffset;

    fireCast(Players.LocalPlayer.GetMouse(), State.Caster, State.CastBehavior, velo);
}