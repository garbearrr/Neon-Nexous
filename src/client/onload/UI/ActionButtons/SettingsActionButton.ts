import { Players } from "@rbxts/services";
import { BaseMainUIActionButton } from "./BaseMainUIButton";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const SettingsButton = MainUI.Top["2_Actions"]["4_Settings"];

class SettingsActionButton extends BaseMainUIActionButton {
    public constructor(Button: typeof SettingsButton) {
        super(Button);
    }

    public override OnActivated(): void {
        super.OnActivated();
    }
}

export default new SettingsActionButton(SettingsButton);