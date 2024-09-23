import { Players } from "@rbxts/services";


export namespace UI.Build {
    const Player = Players.LocalPlayer;
    const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
    const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

    const ShopButton = MainUI.Top["2_Actions"]["1_Build"];
}