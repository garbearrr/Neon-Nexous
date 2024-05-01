import { moduleGet } from "ReplicatedStorage/util/moduleGet";
import { ClientOreModule, ClientOreState } from "./types";
import { DeclareModule } from "@rbxgar/basemodule";
import { Players, VRService } from "@rbxts/services";

export function ClientOre(OrePart: Part, oreId: string, initialValue = 0): ClientOreModule {

    const State: ClientOreState = {
        IsDestroyed:    false,
        OreId:          oreId,
        PhysicalOre:    OrePart,
        Value:          initialValue,
    };

    const Methods = (State: ClientOreState) => ({
        Get: moduleGet(State),
        Process: (Add: number, Multiplier: number) => {
            State.Value *= Multiplier;
            State.Value += Add;
            
            _G.Money += State.Value;
            _G.MoneyText.Text = `$${_G.Money}`;

            if (VRService.VREnabled) {
                const BBChildren = Players.LocalPlayer.FindFirstChild("Backpack")!.GetChildren();
                for (const Child of BBChildren) {
                    if (Child.HasTag("Money")) {
                        Child.Name = `$${_G.Money}`;
                        return;
                    }
                }
            }
        },
        Upgrade: (Add: number, Multiplier: number, MinOreValue: number, MaxOreValue: number) => {
            State.Value *= Multiplier;
            State.Value += Add;
        },
    });

    OrePart.Touched.Connect((HitPart) => {
        if (HitPart.Name === _G.plot.BuildModulePlot.Name) {
            State.PhysicalOre.Destroy();
            _G.OreCache.Delete(State.OreId);
        }
    });

    const IsDestroyed = () => State.IsDestroyed;

    const Mod = { ...Methods(State), IsDestroyed };

    const Destroy = () => {
        State.IsDestroyed = true;

        State.PhysicalOre.Destroy();

        for (const [Key] of pairs(State)) {
            if (Key === "IsDestroyed") continue;
            delete State[Key as keyof ClientOreState];
        }
    }

    return DeclareModule({...Mod, Destroy});
}