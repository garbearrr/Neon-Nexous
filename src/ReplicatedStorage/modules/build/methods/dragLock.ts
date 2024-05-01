import { BuildState } from "../types"


export const dragLock = (State: BuildState, opts: {V?: boolean, H?: boolean}) => {
    if (opts.V) {
        State.DragLockedVertical = true;
        State.DragLockedHorizontal = false;
        return;
    } else if (opts.H) {
        State.DragLockedHorizontal = true;
        State.DragLockedVertical = false;
        return;
    }
}