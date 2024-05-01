import { ReplicatedStorage } from "@rbxts/services";
import { updateInspectCastBehavior } from "./methods";
import { ClientInspectMethods, ClientInspectModule, ClientInspectState } from "./types";
import { ActiveCast, FastCast, FastCastConstructor } from "@rbxgar/fastcast";
import { inspectOnRayHit } from "./helpers/inspectOnRayHit";
import { inspectConnectMouse } from "./helpers/inspectConnectMouse";
import { DeclareModule } from "@rbxgar/basemodule";

export function ClientInspect(): ClientInspectModule {
    const FastCast = require(ReplicatedStorage.WaitForChild("FastCastRedux") as ModuleScript) as FastCast;

    const State: ClientInspectState = {
        CastBehavior: updateInspectCastBehavior(FastCast),
        Caster: new (FastCast as unknown as FastCastConstructor)(),
        CasterConnection: undefined,
        Enabled: false,
        IsDestroyed: false,
        VRToolEquipped: undefined,
    }

    State.CasterConnection = State.Caster.RayHit.Connect(
            (c: ActiveCast, r: RaycastResult, v: Vector3, b: Instance) =>
                inspectOnRayHit(State, c, r, v, b)
    );
    
    const Methods = (State: ClientInspectState): ClientInspectMethods => ({
        Disable: () => {
            State.Enabled = false;
            State.MouseConnection?.Disconnect();
        },
        Enable: () => {
            State.Enabled = true;
            inspectConnectMouse(State);
        },
        SetVRToolEquipped: (Tool?: "Put Away" | "Sell") => {
            State.VRToolEquipped = Tool;
        },
        UpdateBehavior: () => {
            State.CastBehavior = updateInspectCastBehavior(FastCast);
        }
    });

    const IsDestroyed = () => State.IsDestroyed;

    const Mod = { ...Methods(State), IsDestroyed };

    const Destroy = () => {
        State.IsDestroyed = true;

        State.CasterConnection?.Disconnect();
        State.MouseConnection?.Disconnect();

        for (const [Key] of pairs(Mod)) {
            if (Key === "IsDestroyed") continue;
            delete Mod[Key as keyof ClientInspectMethods];
        }

        for (const [Key] of pairs(State)) {
            if (Key === "IsDestroyed") continue;
            delete State[Key as keyof ClientInspectState];
        }
    }

    return DeclareModule({...Mod, Destroy});
}
