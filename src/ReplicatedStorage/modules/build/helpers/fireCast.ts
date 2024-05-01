import { Workspace } from "@rbxts/services";
import { BuildState } from "../types";

export const fireCast = (Mouse: Mouse, Caster: BuildState["Caster"], CastBehavior: BuildState["CastBehavior"], velo: number) => {
    const origin = Workspace.CurrentCamera!.CFrame.Position;
    const direction = Mouse.Hit.Position.sub(origin).Unit;
    Caster.Fire(origin, direction, velo, CastBehavior);
}