import { Input } from "client/modules/Input/Input";
import BuildActionButton from "../UI/ActionButtons/BuildActionButton";

Input.Controls.KeyboardMouse.ToggleBuild.OnDown("build_togg", () => {
    BuildActionButton.ToggleWithEffect();
    print('TOGGLE BUILD');
});