import { Players } from "@rbxts/services";
import { BaseActionButton } from "./BaseActionButton";

import ThreeDeeUI from "../3Duitest";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const SettingsButton = MainUI.Top["2_Actions"]["4_Settings"];

class SettingsActionButton extends BaseActionButton {
    public constructor(Button: typeof SettingsButton) {
        super(Button);
    }

    public override OnActivated(): void {
        super.OnActivated();
        ThreeDeeUI.DisplayPage("Settings");
    }
}

export default new SettingsActionButton(SettingsButton);