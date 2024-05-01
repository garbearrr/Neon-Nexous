import { ClientOre } from "ReplicatedStorage/client/ore/ore";
import { CIC } from "../../constants";
import { canDropOre } from "../../helpers/canDropOre";
import { ClientDropperState } from "../../types";

export const drop = (State: ClientDropperState) => {
    if (!canDropOre(State)) return;

    const id = tick();

    const Clone = State.Ore.Clone();
    Clone.WeldConstraint.Destroy();
    Clone.Parent = CIC.ORE_PARENT;
    Clone.CFrame = State.DropAttachment.WorldCFrame;
    Clone.Name = `${id}`;
    Clone.Anchored = false;
    Clone.CanCollide = true;
    Clone.CanTouch = true;

    const Ore = ClientOre(Clone, `${id}`, State.OreValue);
    _G.OreCache.Set(`${id}`, Ore);

    State.LastDropTime = tick();
}