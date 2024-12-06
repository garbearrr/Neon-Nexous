import { Players, RunService } from "@rbxts/services";
import { BaseMainUIActionButton } from "./BaseMainUIButton";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const DebugButton = MainUI.Left["Actions"]["99_Debug"];

class DebugActionButton extends BaseMainUIActionButton {
    public constructor(Button: typeof DebugButton) {
        super(Button);
    }

    public override OnActivated(): void {
        //if (!RunService.IsStudio()) return;
        super.OnActivated();
    }
}

export default new DebugActionButton(DebugButton);