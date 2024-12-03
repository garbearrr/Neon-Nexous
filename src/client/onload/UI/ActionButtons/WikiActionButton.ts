import { Players } from "@rbxts/services";
import { BaseMainUIActionButton } from "./BaseMainUIButton";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const WikiButton = MainUI.Left["Actions"]["5_Wiki"];

class WikiActionButton extends BaseMainUIActionButton {
    public constructor(Button: typeof WikiButton) {
        super(Button);
    }

    public override OnActivated(): void {
        super.OnActivated();
    }
}

export default new WikiActionButton(WikiButton);