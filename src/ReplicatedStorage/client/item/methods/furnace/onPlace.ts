import { ClientFurnaceState } from "../../types";


export const furnaceOnPlace = (State: ClientFurnaceState) => {
    State.Receiver.Touched.Connect((HitPart) => {
        const Ore = _G.OreCache.Get(HitPart.Name);

        if (Ore === undefined) return;

        Ore.Process(State.Add, State.Multiplier);
        _G.OreCache.Delete(HitPart.Name);
        Ore.Destroy();
    });
}