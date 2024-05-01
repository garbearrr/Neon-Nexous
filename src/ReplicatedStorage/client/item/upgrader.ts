import { moduleGet } from "ReplicatedStorage/util/moduleGet";
import { ClientUpgrader, ClientUpgraderMethods, ClientUpgraderModule, ClientUpgraderState, ClientItemMethods, ClientItemState } from "./types";
import { DeclareModule } from "@rbxgar/basemodule";
import { upgraderOnPlaced, upgraderOnSetup } from "./methods/upgrader";

export function ClientUpgrader(Item: ClientUpgrader, placementId: string): ClientUpgraderModule {

    const State: ClientUpgraderState = {
        Add:            Item.Stats.Add.Value,
        ClickDetector:  Item.ClickDetector,
        Conveyor:       Item.Conveyor,
        Cost:           Item.Stats.Cost.Value,
        IsDestroyed:    false,
        ItemId:         tostring(Item.Stats.ItemId.Value),
        MinOreValue:    Item.Stats.MinOreValue.Value,
        MaxOreValue:    Item.Stats.MaxOreValue.Value,
        Multiplier:     Item.Stats.Multiplier.Value,
        ItemName:       Item.Stats.ItemName.Value,
        PhysicalItem:   Item,
        PlacementId:    placementId,
        Type:           "Upgrader",
        UpgradePart:    Item.Upgrade,
    };

    const Methods = (State: ClientUpgraderState): ClientUpgraderMethods => ({
        Get: moduleGet(State),
        FireDragged: () => {},
        FireMoved: () => {},
        FirePlaced: () => upgraderOnPlaced(State),
        FireRotated: () => {},
        FireSetup: () => upgraderOnSetup(State),
        FireUndragged: () => {},
        IsAConveyor: () => false,
        IsADropper: () => false,
        IsAFurnace: () => false,
        IsAnUpgrader: () => true,
    });

    const IsDestroyed = () => State.IsDestroyed;

    const Mod = { ...Methods(State), IsDestroyed };

    const Destroy = () => {
        State.IsDestroyed = true;

        State.PhysicalItem.Destroy();

        for (const [Key] of pairs(State)) {
            if (Key === "IsDestroyed") continue;
            delete State[Key as keyof ClientUpgraderState];
        }
    }

    return DeclareModule({...Mod, Destroy});
}