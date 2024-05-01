import { CBC } from "../constants";
import { ClientBuildState } from "../types";
import { canPlaceItem } from "./canPlaceItem";
import { ClientItem } from "ReplicatedStorage/client/item/types";
import { getItemMod } from "./getItemMod";
import { onMouseHoverEnter } from "ReplicatedStorage/client/inspect/onMouseHoverEnter";
import { onMouseHoverLeave } from "ReplicatedStorage/client/inspect/onMouseHoverLeave";

let pid = 0;

export const onPlace = (State: ClientBuildState, ItemId: number, CF: CFrame[]) => {
    for (const Cframe of CF) {
        const Clone = State.Item.Clone();
        Clone.CFrame = Cframe.mul(new CFrame(0, CBC.COLLISION_CHECK_Y_OFFSET, 0));
        Clone.Parent = CBC.PLACED_ITEM_LOC;

        if (!canPlaceItem(State, Clone.CollisionHitbox, true)) {
            Clone.Destroy();
            print("Cant place item!")
            continue;
        }

        const placementId = tostring(pid++);
        Clone.Name = tostring(placementId);
        
        const Mod = getItemMod(Clone as ClientItem, placementId);

        Clone.ClickDetector.MaxActivationDistance = 1000;
        Clone.ClickDetector.MouseHoverEnter.Connect((Player) => onMouseHoverEnter(Player, Clone));
        Clone.ClickDetector.MouseHoverLeave.Connect((Player) => onMouseHoverLeave(Player, Clone));

        _G.ItemPlaceCache.Set(
            placementId,
            Mod
        );

        Mod.FirePlaced();

        Clone.CFrame = Cframe;
        Clone.Transparency = 1;
    }

    State.DragCache.ForEach((Part) => {
        Part.Destroy();
    });

    State.DragCache.Clear();

    State.InspectMod.UpdateBehavior();
};