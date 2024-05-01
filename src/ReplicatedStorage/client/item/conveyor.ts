import { moduleGet } from "ReplicatedStorage/util/moduleGet";
import { ClientConveyor, ClientConveyorMethods, ClientConveyorModule, ClientConveyorState } from "./types";
import { DeclareModule } from "@rbxgar/basemodule";
import { conveyorOnPlaced, conveyorOnSetup } from "./methods/conveyor";

export function ClientConveyor(Item: ClientConveyor, placementId: string): ClientConveyorModule {

    const State: ClientConveyorState = {
        ClickDetector:  Item.ClickDetector,
        Cost:           Item.Stats.Cost.Value,
        IsDestroyed:    false,
        ItemId:         tostring(Item.Stats.ItemId.Value),
        ItemName:       Item.Stats.ItemName.Value,
        PhysicalItem:   Item,
        PlacementId:    placementId,
        Speed:          Item.Stats.Speed.Value,
        Type:           "Conveyor",
    };

    const Methods = (State: ClientConveyorState): ClientConveyorMethods => ({
        Get: moduleGet(State),
        FireDragged: () => {},
        FireMoved: () => {},
        FirePlaced: () => conveyorOnPlaced(State),
        FireRotated: () => {},
        FireSetup: () => conveyorOnSetup(State),
        FireUndragged: () => {},
        IsAConveyor: () => true,
        IsADropper: () => false,
        IsAFurnace: () => false,
        IsAnUpgrader: () => false,
    });

    const IsDestroyed = () => State.IsDestroyed;

    const Mod = { ...Methods(State), IsDestroyed };

    const Destroy = () => {
        State.IsDestroyed = true;

        State.PhysicalItem.Destroy();

        for (const [Key] of pairs(State)) {
            if (Key === "IsDestroyed") continue;
            delete State[Key as keyof ClientConveyorState];
        }
    }

    return DeclareModule({...Mod, Destroy});
}