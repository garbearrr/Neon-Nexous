import { Players } from "@rbxts/services";
import { BaseActionButton } from "./BaseActionButton";
import { Placement } from "client/modules/Placement/Placement";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const BuildButton = MainUI.Left["Actions"]["1_Build"];

class BuildActionButton extends BaseActionButton {
    public constructor(Button: typeof BuildButton) {
        super(Button);
    }

    public override OnActivated(): void {
        const Active = this.IsActivated();
        super.OnActivated();

        if (Active) {
            Placement.Deactivate();
            return;
        } else {
            Placement.ActivateManager();
        }
    }

    public SetOn(): void {
        this.ToggleOn();
    }

    public ToggleWithEffect(): void {
        this.OnActivated();
    }
}

export default new BuildActionButton(BuildButton);