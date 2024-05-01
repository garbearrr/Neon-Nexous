import { FastCast, FastCastBehavior } from "@rbxgar/fastcast";
import { BaseClientItemModule } from "ReplicatedStorage/client/item/types";

export const updateInspectCastBehavior = (FC: FastCast): FastCastBehavior => {
    const Behavior = FC.newBehavior();
    Behavior.AutoIgnoreContainer = false;
	Behavior.RaycastParams = new RaycastParams();
	Behavior.RaycastParams.IgnoreWater = true;
	Behavior.RaycastParams.FilterType = Enum.RaycastFilterType.Include;
	Behavior.RaycastParams.FilterDescendantsInstances = _G.ItemPlaceCache.Map((Item) => (Item as BaseClientItemModule).Get("PhysicalItem"));

    return Behavior;
}