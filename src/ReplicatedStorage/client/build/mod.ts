import { Build } from "ReplicatedStorage/modules/build/build";
import { ClientBuildMethods, ClientBuildModule, ClientBuildState } from "./types";
import { DeclareModule } from "@rbxgar/basemodule";
import { Camera } from "@rbxgar/camera";
import { Collection } from "@rbxgar/collection";
import { ContextActionService } from "@rbxts/services";
import { activate } from "./methods";
import { BaseClientItem, ClientItem, ClientItemModule } from "../item/types";
import { configureItemGuide } from "./helpers";
import { getItemMod } from "./helpers/getItemMod";
import { ClientInspectModule } from "../inspect/types";
import { vractivate } from "./helpers/vractivate";
import { moduleGet } from "ReplicatedStorage/util/moduleGet";

const ACTIVE_BM = Enum.KeyCode.E;
const ROTATE_BM = Enum.KeyCode.R;
const PLACE_BM  = Enum.UserInputType.MouseButton1;

export function ClientBuild(Item: BaseClientItem, ClientInspectMod: ClientInspectModule): ClientBuildModule {
    
    const State: ClientBuildState = {
        Actions:        [],
        BuildMod:       Build(0, Item.Size),
        CamMod:         Camera(_G.plot.BuildModulePlot.CameraContainer),
        Controls:       {
            Activate:   ACTIVE_BM,
            Rotate:     ROTATE_BM,
            Place:      PLACE_BM,
        },
        CurrentTween:   undefined,
        DragCache:      Collection<string, ClientItemModule>(),
        InspectMod:     ClientInspectMod,
        IsDestroyed:    false,
        Item:           Item,
        ItemGuide:      Item.Clone(),
        TweenIsMoving:  false,
    }

    configureItemGuide(State.ItemGuide);
    getItemMod(State.ItemGuide as ClientItem).FireSetup();

    const Methods = (State: ClientBuildState): ClientBuildMethods => ({
        Activate: (vr = false, Item?: BaseClientItem) => {
            if (vr === false)
                activate(State)
            else 
                vractivate(State, Item!);
        },
        Get: moduleGet(State),
    });

    const IsDestroyed = () => State.IsDestroyed;

    const Mod = { ...Methods(State), IsDestroyed };

    const Destroy = () => {
        State.IsDestroyed = true;

        State.ItemGuide.Destroy();

        for (const Action of State.Actions) {
            ContextActionService.UnbindAction(Action);
        }

        for (const [Key] of pairs(State)) {
            if (Key === "IsDestroyed") continue;
            //delete State[Key as keyof ClientBuildState];
        }
    }

    return DeclareModule({ ...Mod, Destroy });
}