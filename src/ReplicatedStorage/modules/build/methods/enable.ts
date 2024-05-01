import { Players, Workspace } from "@rbxts/services";
import { fireCast } from "../helpers";
import { BuildState } from "../types";

export const enable = (State: BuildState, Signal: RBXScriptSignal, velo: number) => {
    const Mouse = Players.LocalPlayer.GetMouse();
    
    const FireConnection = Signal.Connect(() => 
        fireCast(Mouse, State.Caster, State.CastBehavior, velo)
    );

    const origin = Workspace.CurrentCamera!.CFrame.Position;
    const direction = Mouse.Hit.Position.sub(origin).Unit;
    State.Caster.Fire(origin, direction, velo, State.CastBehavior);

    State.Connections.push(FireConnection);

    State.Enabled = true;
};