import { activateConveyor } from "../../helpers/activateConveyor";
import { ClientUpgraderState } from "../../types";

export const upgraderOnPlaced = (State: ClientUpgraderState) => {
    State.PhysicalItem.Conveyor.DirectionIndicator.Enabled = false;
    
    activateConveyor(
        State.PhysicalItem.Conveyor.ConveyA1, 
        State.PhysicalItem.Conveyor.ConveyA2, 
        State.PhysicalItem.Conveyor.Speed.Value, 
        State.PhysicalItem.Conveyor
    );

    State.UpgradePart.Touched.Connect((HitPart) => {
        const Ore = _G.OreCache.Get(HitPart.Name);

        if (Ore === undefined) return;

        Ore.Upgrade(State.Add, State.Multiplier, State.MinOreValue, State.MaxOreValue);
    });
}