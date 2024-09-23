import { Input } from "client/modules/Input/Input";
import { Placement } from "client/modules/Placement/Placement";

Input.Controls.KeyboardMouse.ToggleBuild.OnDown("build_togg", () => {
    Placement.Toggle(30000);
    print('TOGGLE BUILD');
});