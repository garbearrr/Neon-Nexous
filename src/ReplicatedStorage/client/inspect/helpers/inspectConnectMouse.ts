import { Players, UserInputService, Workspace } from "@rbxts/services";
import { ClientInspectState } from "../types";


export const inspectConnectMouse = (State: ClientInspectState) => {
    State.MouseConnection?.Disconnect();
    
    const Mouse = Players.LocalPlayer.GetMouse();

    const MouseMoveConnection = UserInputService.InputEnded.Connect((input) => {
        if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
        if (State.Enabled) {
            const origin = Workspace.CurrentCamera!.CFrame.Position;
            const direction = Mouse.Hit.Position.sub(origin).Unit;

            State.Caster.Fire(
                origin,
                direction,
                1000,
                State.CastBehavior
            );
        }
    });

    State.MouseConnection = MouseMoveConnection;
}