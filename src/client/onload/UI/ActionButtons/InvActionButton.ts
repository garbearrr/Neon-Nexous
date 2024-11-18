import { Players } from "@rbxts/services";
import { BaseMainUIActionButton } from "./BaseMainUIButton";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const InvButton = MainUI.Left["Actions"]["2_Inventory"];

class InventoryActionButton extends BaseMainUIActionButton {
    public constructor(Button: typeof InvButton) {
        super(Button);
    }

    public override OnActivated(): void {
        super.OnActivated();
    }
}

export default new InventoryActionButton(InvButton);