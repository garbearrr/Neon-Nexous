import { Players } from "@rbxts/services";

Players.LocalPlayer.CharacterAdded.Wait();

import { Input } from "./modules/Input/Input";
import { Debug } from "./modules/Debug/Debug";
import { Placement } from "./modules/Placement/Placement";

Debug.Enable();

Input.Controls.KeyboardMouse.ToggleBuild.OnDown("build_togg", () => {
    Placement.Toggle(30000);
    print('TOGGLE BUILD');
});