import { GridState } from "../types";

export const setGridTexture = (State:GridState, Texture: Texture): void => {
    State.GridTexture = Texture;
}