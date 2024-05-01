import { BaseClientItem, ClientItem } from "ReplicatedStorage/client/item/types";
import { ClientBuildState } from "../types";
import { Build } from "ReplicatedStorage/modules/build/build";
import { startOrUpdateTween } from "./startOrUpdateTween";
import { dragUpdate } from "./dragUpdate";
import { onPlace } from "./onPlace";
import { setNewItem } from "./setNewItem";
import { getItemMod } from "./getItemMod";
import { ContextActionService } from "@rbxts/services";


export const vractivate = (State: ClientBuildState, Item: BaseClientItem) => {
    State.BuildMod = Build(Item.Stats.ItemId.Value, Item.Size);

    setNewItem(State, Item);

    State.InspectMod.Disable();

    const Mod = getItemMod(State.ItemGuide as ClientItem);
    Mod.FireSetup();

    State.BuildMod.OnMove.Connect(({ Pos, Rot }) => startOrUpdateTween(State, Pos, Rot));
    State.BuildMod.OnDrag.Connect(({ Added, CF }) => dragUpdate(State, Added, CF));
    State.BuildMod.OnPlace.Connect(({ ItemId, CF }) => onPlace(State, ItemId, CF));

    State.BuildMod.Enable();

    State.BuildMod.DragLock({ H: false, V: true });

    ContextActionService.BindAction("Rotate", (_, state, __) => {
        if (state !== Enum.UserInputState.Begin || !State.BuildMod) return;

        State.BuildMod.Rotate();

        const rot = State.BuildMod.GetRotation();
        if (rot % 90 === 0) State.BuildMod.DragLock({ H: false, V: true });
        else State.BuildMod.DragLock({ H: true, V: false });
    }, false, Enum.KeyCode.ButtonY);

    ContextActionService.BindAction("Place", (_, state, __) => {
        if (!State.BuildMod) return;

        if (state === Enum.UserInputState.Begin)
            State.BuildMod.PlaceItem();
        else if (state === Enum.UserInputState.End)
            State.BuildMod.PlaceItem(true);

    }, false, Enum.KeyCode.ButtonR2);
}