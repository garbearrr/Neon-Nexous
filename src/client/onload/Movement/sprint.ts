import { Players } from "@rbxts/services";
import { Input } from "client/modules/Input/NewInput";
//import { Input } from "client/modules/Input/Input";

const Humanoid = Players.LocalPlayer.Character?.WaitForChild("Humanoid") as Humanoid;
const OriginalWalkSpeed = Humanoid.WalkSpeed;

/*
Input.Controls.KeyboardMouse.Sprint.OnDown("sprint", () => {
    Humanoid.WalkSpeed = OriginalWalkSpeed * 2;
});

Input.Controls.KeyboardMouse.Sprint.OnUp("sprint", () => {
    Humanoid.WalkSpeed = OriginalWalkSpeed;
});*/

Input.NewListener("Sprint")
    .AddActivationControls(Enum.KeyCode.LeftShift);

Input.Control("Sprint").OnDown.Connect(() => {
    Humanoid.WalkSpeed = OriginalWalkSpeed * 2;
});

Input.Control("Sprint").OnUp.Connect(() => {
    Humanoid.WalkSpeed = OriginalWalkSpeed;
});