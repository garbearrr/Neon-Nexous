import { Players } from "@rbxts/services";
import { Sunset } from "client/modules/Sunset/Sunset";
import { DragBarWidget } from "client/modules/UI/DragBarWidget";
import { MultiButtonWidget } from "client/modules/UI/MultiButtonWidget";
import { WidgetPage } from "client/modules/UI/WidgetPage";
import { DebugWidgetManager } from "../debug";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const DebugFrame = MainUI.MainFrame.Content.ScrollingFrame.Debug.Content.SettingsFrame.ScrollingFrame;

const ChangeTime = new DragBarWidget("Change Time")
    .SetBounds(0, 24)
    .SetButtonIncrementDecrement(1)
    .SetUpdateCallback(() => {
        return Sunset.GetTime();
    })
    .SetActionCallback((Value) => {
        Sunset.SetTime(Value);
    })
    .MakeUpdateVisible()
    .Update();

const CycleSpeed = new DragBarWidget("Cycle Speed")
    .SetBounds(0, 1)
    .SetButtonIncrementDecrement(0.1)
    .SetUpdateCallback(() => {
        return Sunset.GetCycleSpeed();
    })
    .SetActionCallback((Value) => {
        Sunset.SetCycleSpeed(Value);
    })
    .MakeUpdateVisible()
    .Update();

const PP = new MultiButtonWidget("Play/Pause")
    .AddButton("Play", (Button) => {
        Sunset.Resume();
        PP.Update();
    })
    .AddButton("Pause", (Button) => {
        Sunset.Pause();
        PP.Update();
    })
    .SetUpdateCallback(() => {
        return `Running: ${Sunset.IsRunning()}`;
    })
    .MakeUpdateVisible()
    .Update();

const SkipTo = new MultiButtonWidget("Skip To")
    .AddButton("Day", (Button) => {
        Sunset.SkipToDay(1);
    })
    .AddButton("Sunrise", (Button) => {
        Sunset.SkipTo(8, 1);
    })
    .AddButton("Noon", (Button) => {
        Sunset.SkipTo(12, 1);
    })
    .AddButton("Night", (Button) => {
        Sunset.SkipToNight(1);
    });


const Page = new WidgetPage("Day/Night Cycle", DebugFrame)
    .AddWidget(ChangeTime)
    .AddWidget(CycleSpeed)
    .AddWidget(PP)
    .AddWidget(SkipTo)
    .ShowWidgets();


DebugWidgetManager.AddPage(Page);
