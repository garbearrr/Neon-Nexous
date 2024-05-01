import { ContextActionService, Workspace } from "@rbxts/services";
import { ClientBuildState } from "../types";
import { Build } from "ReplicatedStorage/modules/build/build";
import { dragUpdate, onPlace, setNewItem, startOrUpdateTween } from "../helpers";
import { ClientItem } from "ReplicatedStorage/client/item/types";
import { getItemMod } from "../helpers/getItemMod";

const TempItemCycle = [
    Workspace.Items.Droppers["Erbium Mine"]["10000"],
    Workspace.Items.Furnaces["Ore Processor"]["20000"],
    Workspace.Items.Upgraders["Erbium Infusor"]["40000"],
    Workspace.Items.Conveyors.Conveyor["30000"]
]

let tempCycleIndex = 0;

export const activate = (State: ClientBuildState) => {
    ContextActionService.BindAction("Build", (actionName, state, inputObject) => { 
        if (state !== Enum.UserInputState.Begin) return;
    
        if (State.BuildMod !== undefined) {
            State.BuildMod.Destroy();
            State.BuildMod = undefined;
            State.CamMod.Toggle(false);
            // TODO: TEMP
            tempCycleIndex++;
            setNewItem(State, TempItemCycle[tempCycleIndex % TempItemCycle.size()]);

            const Mod = getItemMod(State.ItemGuide as ClientItem);
            Mod.FireSetup();

            State.InspectMod.Enable();

            return;
        }
    
        State.BuildMod = Build(State.Item.Stats.ItemId.Value, State.Item.Size);
    
        State.BuildMod.OnMove.Connect(({ Pos, Rot }) => startOrUpdateTween(State, Pos, Rot));
        State.BuildMod.OnDrag.Connect(({ Added, CF }) => dragUpdate(State, Added, CF));
        State.BuildMod.OnPlace.Connect(({ ItemId, CF }) => onPlace(State, ItemId, CF));

        State.InspectMod.Disable();
    
        State.BuildMod.Enable();
        State.CamMod.Toggle(true);
    
        ContextActionService.BindAction("Rotate", (_, state, __) => {
            if (state !== Enum.UserInputState.Begin || !State.BuildMod) return;
    
            State.BuildMod.Rotate();
        }, false, State.Controls.Rotate);
    
        ContextActionService.BindAction("Place", (_, state, __) => {
            if (!State.BuildMod) return;
    
            if (state === Enum.UserInputState.Begin)
                State.BuildMod.PlaceItem();
            else if (state === Enum.UserInputState.End)
                State.BuildMod.PlaceItem(true);
    
        }, false, State.Controls.Place);
    
    }, false, State.Controls.Activate);
}