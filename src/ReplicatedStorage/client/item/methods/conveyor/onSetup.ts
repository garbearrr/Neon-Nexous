import { ClientConveyorState } from "../../types";


export const conveyorOnSetup = (State: ClientConveyorState) => {
    State.PhysicalItem.DirectionIndicator.Enabled = true;
}