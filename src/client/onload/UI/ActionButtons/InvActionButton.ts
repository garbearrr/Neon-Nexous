import { Players } from "@rbxts/services";
import { BaseActionButton } from "./BaseActionButton";

import ThreeDeeUI from "../3Duitest";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const InvButton = MainUI.Top["2_Actions"]["2_Inventory"];

class InventoryActionButton extends BaseActionButton {
    public constructor(Button: typeof InvButton) {
        super(Button);
    }

    public override OnActivated(): void {
        super.OnActivated();
        ThreeDeeUI.DisplayPage("Inventory");
    }
}

export default new InventoryActionButton(InvButton);