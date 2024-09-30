import { Players } from "@rbxts/services";
import { BaseActionButton } from "./BaseActionButton";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";

import ShopMenuGrid from "../ItemMenuGrids/ShopMenuGrid";

const TI_TIMEOUT = 0.3;

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const ShopButton = MainUI.Top["2_Actions"]["3_Shop"];

class ShopActionButton extends BaseActionButton {

    private ToggleTimeOut: boolean = false;

    public constructor(Button: typeof ShopButton) {
        super(Button);

        ShopMenuGrid.SetTweenTime(TI_TIMEOUT);
        ShopMenuGrid.Events.OnClose.Connect(() => this.ShopOnClose());
    }

    protected override OnActivated(): void {
        if (this.ToggleTimeOut) return;
        this.ToggleTimeOut = true;

        this.Toggle();
        ShopMenuGrid.ToggleMenu();

        Scheduling.SetTimeout(() => this.ToggleTimeOut = false, TI_TIMEOUT);
    }

    private ShopOnClose() {
        if (this.ToggleTimeOut) return;
        this.ToggleTimeOut = true;
        
        this.Toggle();

        Scheduling.SetTimeout(() => this.ToggleTimeOut = false, TI_TIMEOUT);
    }
}

export default new ShopActionButton(ShopButton);