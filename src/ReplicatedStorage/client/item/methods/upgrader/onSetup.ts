import { ClientUpgraderState } from "../../types";


export const upgraderOnSetup = (State: ClientUpgraderState) => {
    State.PhysicalItem.Conveyor.DirectionIndicator.Enabled = true;
}