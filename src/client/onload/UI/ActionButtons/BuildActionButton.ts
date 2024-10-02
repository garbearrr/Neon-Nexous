import { Players } from "@rbxts/services";
import { BaseActionButton } from "./BaseActionButton";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const BuildButton = MainUI.Top["2_Actions"]["1_Build"];

class BuildActionButton extends BaseActionButton {
    public constructor(Button: typeof BuildButton) {
        super(Button);
    }
}

export default new BuildActionButton(BuildButton);