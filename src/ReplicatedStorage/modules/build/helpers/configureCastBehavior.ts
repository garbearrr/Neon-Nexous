import { FastCast, FastCastBehavior } from "@rbxgar/fastcast";
import { GridState } from "ReplicatedStorage/modules/grid/types";

export const configureCastBehavior = (FC: FastCast, GridParentPart: GridState["ParentGridPart"]): FastCastBehavior => {
    const Behavior = FC.newBehavior();
    Behavior.AutoIgnoreContainer = false;
	Behavior.RaycastParams = new RaycastParams();
	Behavior.RaycastParams.IgnoreWater = true;
	Behavior.RaycastParams.FilterType = Enum.RaycastFilterType.Include;
	Behavior.RaycastParams.FilterDescendantsInstances = [
		GridParentPart
	];

    return Behavior;
}