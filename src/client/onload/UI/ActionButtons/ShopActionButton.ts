import { Players } from "@rbxts/services";
import { BaseMainUIActionButton } from "./BaseMainUIButton";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const ShopButton = MainUI.Top["2_Actions"]["3_Shop"];

class ShopActionButton extends BaseMainUIActionButton {
    public constructor(Button: typeof ShopButton) {
        super(Button);
    }

    public override OnActivated(): void {
        super.OnActivated();
    }
}

export default new ShopActionButton(ShopButton);