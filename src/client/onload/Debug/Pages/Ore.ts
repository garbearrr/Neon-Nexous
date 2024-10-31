import { Players } from "@rbxts/services";
import { WidgetPage } from "client/modules/UI/WidgetPage";
import { DebugWidgetManager } from "../debug";
import { MultiToggleWidget } from "client/modules/UI/MultiToggleWidget";
import { OreManager } from "client/modules/Ore/OreManager";
import { Dropper } from "client/modules/Item/Dropper";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const DebugFrame = MainUI.MainFrame.Content.ScrollingFrame.Debug.Content.SettingsFrame.ScrollingFrame;

const Page = new WidgetPage("Ore", DebugFrame);

const Freeze = new MultiToggleWidget("Freeze Ore")
    .AddButton("Freeze Ore", (NewValue) => {
        if (NewValue) {
            Dropper.PauseAllDroppers();
            OreManager.FreezeOre();
        } else {
            Dropper.ResumeAllDroppers();
            OreManager.UnfreezeOre();
        }
    })
    .SetUpdateCallback(() => {
        return [["Freeze Ore", Dropper.AreDroppersPaused()]];
    });

Page
    .AddWidget(Freeze)
    .ShowWidgets();


DebugWidgetManager.AddPage(Page);