import { BuildEvents, BuildState } from "../types";


export const placeInputEnd = (State: BuildState, PlaceEvent: BuildEvents["OnPlace"]) => {
    State.PlaceInputDown = false;

    PlaceEvent.Fire({
        ItemId: State.ItemId,
        CF: State.Drag.size() > 0 ? State.Drag : [State.LastTargetCFrame]
    });

    State.Drag = [];
    State.DragStart = undefined;
}