import { TweenService } from "@rbxts/services";
import { ClientBuildState } from "../types";
import { CBC } from "../constants";
import { BaseClientItemModule, ClientItem } from "ReplicatedStorage/client/item/types";
import { canPlaceItem } from "./canPlaceItem";
import { getItemMod } from "./getItemMod";

export const dragUpdate = (State: ClientBuildState, adding: boolean, Pos: CFrame[]) => {
    if (adding) {
        for (const CF of Pos) {
            const Clone = State.Item.Clone() as ClientItem;
            Clone.Parent = _G.plot.Temp;
            Clone.CFrame = CF;
            Clone.Anchored = true;

            const Mod = getItemMod(Clone);

            Mod.FireSetup();
            Mod.FireDragged();

            const Tween = TweenService.Create(Clone as Part, CBC.TI, { Size: State.Item.Size });
            Tween.Completed.Connect(() => { 
                Clone.Size = State.Item.Size;
            });
            Tween.Play();

            const Key = `${CF.Position.X},${CF.Position.Z}`;
            State.DragCache.Set(Key, Mod);

            if (!canPlaceItem(State, Clone.CollisionHitbox)){
                Clone.Transparency = 0.8;
                Clone.Color = CBC.CANT_PLACE_COLOR;
            } else {
                Clone.Transparency = 1;
            }
        }
    } else {
        for (const CF of Pos) {
            const Key = `${CF.Position.X},${CF.Position.Z}`;
            const I = State.DragCache.Get(Key) as BaseClientItemModule;

            if (!I) continue;

            I.FireUndragged();

            State.DragCache.Delete(Key);

            const Tween = TweenService.Create(I.Get("PhysicalItem"), CBC.TI, { Size: new Vector3(0, 0, 0) });
            Tween.Completed.Connect(() => I.Destroy());
            Tween.Play();
        }
    }
}