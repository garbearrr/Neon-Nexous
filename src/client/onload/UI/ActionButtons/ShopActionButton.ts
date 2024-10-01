import { Players } from "@rbxts/services";
import { BaseActionButton } from "./BaseActionButton";

import ThreeDeeUI from "../3DUI/3Duitest";

const TI_TIMEOUT = 0.3;

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const ShopButton = MainUI.Top["2_Actions"]["3_Shop"];

class ShopActionButton extends BaseActionButton {

    private ToggleTimeOut: boolean = false;

    public constructor(Button: typeof ShopButton) {
        super(Button);

        //ShopMenuGrid.SetTweenTime(TI_TIMEOUT);
        //ShopMenuGrid.Events.OnClose.Connect(() => this.ShopOnClose());
    }

    public override OnActivated(): void {
        super.OnActivated();
        ThreeDeeUI.DisplayPage("Shop");
    }
}

export default new ShopActionButton(ShopButton);