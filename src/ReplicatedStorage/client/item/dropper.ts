import { moduleGet } from "ReplicatedStorage/util/moduleGet";
import { ClientDropper, ClientDropperMethods, ClientDropperModule, ClientDropperState, ClientItemMethods, ClientItemState } from "./types";
import { DeclareModule } from "@rbxgar/basemodule";
import { drop } from "./methods/dropper/drop";

export function ClientDropper(Item: ClientDropper, placementId: string): ClientDropperModule {

    const State: ClientDropperState = {
        ClickDetector:  Item.ClickDetector,
        Cost:           Item.Stats.Cost.Value,
        DropAttachment: Item.Drop,
        DropSpeed:      Item.Stats.DropSpeed.Value,
        IsDestroyed:    false,
        LastDropTime:   0,
        ItemName:       Item.Stats.ItemName.Value,
        Ore:            Item.Ore,
        OreValue:       Item.Stats.OreValue.Value,
        ItemId:         tostring(Item.Stats.ItemId.Value),
        PhysicalItem:   Item,
        PlacementId:    placementId,
        Type:           "Dropper",
    };

    const Methods = (State: ClientDropperState): ClientDropperMethods => ({
        Get: moduleGet(State),
        Drop: () => drop(State),
        FireDragged: () => {},
        FireMoved: () => {},
        FirePlaced: () => {},
        FireRotated: () => {},
        FireSetup: () => {},
        FireUndragged: () => {},
        IsAConveyor: () => false,
        IsADropper: () => true,
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
            delete State[Key as keyof ClientDropperState];
        }
    }

    return DeclareModule({...Mod, Destroy});
}