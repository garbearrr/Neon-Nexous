import { GridState } from "../types";

export const toggleGrid = (State: GridState, on?: boolean): void => {
    if(on === undefined) 
        on = State.GridTexture.Transparency === State.OriginalGridTransparency;

    State.GridTexture.Transparency = on ? State.OriginalGridTransparency : 1;
}
