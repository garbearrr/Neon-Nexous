import { activateConveyor } from "../../helpers/activateConveyor";
import { ClientConveyorState } from "../../types";

export const conveyorOnPlaced = (State: ClientConveyorState) => {
    State.PhysicalItem.DirectionIndicator.Enabled = false;
    activateConveyor(State.PhysicalItem.ConveyA1, State.PhysicalItem.ConveyA2, State.Speed, State.PhysicalItem.CollisionHitbox);
}