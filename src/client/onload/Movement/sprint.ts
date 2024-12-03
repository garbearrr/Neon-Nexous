import { Players } from "@rbxts/services";
import { Input } from "client/modules/Input/Input";

const Humanoid = Players.LocalPlayer.Character?.WaitForChild("Humanoid") as Humanoid;
const OriginalWalkSpeed = Humanoid.WalkSpeed;

Input.Controls.KeyboardMouse.Sprint.OnDown("sprint", () => {
    Humanoid.WalkSpeed = OriginalWalkSpeed * 2;
});

Input.Controls.KeyboardMouse.Sprint.OnUp("sprint", () => {
    Humanoid.WalkSpeed = OriginalWalkSpeed;
});