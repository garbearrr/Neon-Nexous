import { moduleGet } from "ReplicatedStorage/util/moduleGet";
import { ClientFurnace, ClientFurnaceMethods, ClientFurnaceModule, ClientFurnaceState, ClientItemMethods, ClientItemState } from "./types";
import { DeclareModule } from "@rbxgar/basemodule";
import { furnaceOnPlace } from "./methods/furnace/onPlace";

export function ClientFurnace(Item: ClientFurnace, placementId: string): ClientFurnaceModule {

    const State: ClientFurnaceState = {
        Add:            Item.Stats.Add.Value,
        ClickDetector:  Item.ClickDetector,
        Cost:           Item.Stats.Cost.Value,
        IsDestroyed:    false,
        ItemId:         tostring(Item.Stats.ItemId.Value),
        Multiplier:     Item.Stats.Multiplier.Value,
        ItemName:       Item.Stats.ItemName.Value,
        PhysicalItem:   Item,
        PlacementId:    placementId,
        Receiver:       Item.Receiver,
        Type:           "Furnace",
    };

    const Methods = (State: ClientFurnaceState): ClientFurnaceMethods => ({
        Get: moduleGet(State),
        FireDragged: () => {},
        FireMoved: () => {},
        FirePlaced: () => furnaceOnPlace(State),
        FireRotated: () => {},
        FireSetup: () => {},
        FireUndragged: () => {},
        IsAConveyor: () => false,
        IsADropper: () => false,
        IsAFurnace: () => true,
        IsAnUpgrader: () => false,
    });

    const IsDestroyed = () => State.IsDestroyed;

    const Mod = { ...Methods(State), IsDestroyed };

    const Destroy = () => {
        State.IsDestroyed = true;

        State.PhysicalItem.Destroy();

        for (const [Key] of pairs(State)) {
            if (Key === "IsDestroyed") continue;
            delete State[Key as keyof ClientFurnaceState];
        }
    }

    return DeclareModule({...Mod, Destroy});
}