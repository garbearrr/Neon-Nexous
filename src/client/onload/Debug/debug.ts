import { Players } from "@rbxts/services";
import { Debug } from "client/modules/Debug/Debug";
import { DebugItemImaging } from "client/modules/Debug/ItemImaging";
import { Sunset } from "client/modules/Sunset/Sunset";
import { DragBarWidget } from "client/modules/UI/DragBarWidget";
import { WidgetPage } from "client/modules/UI/WidgetPage";


//Debug.Enable();

//DebugItemImaging.Activate();

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const DebugFrame = MainUI.MainFrame.Content.ScrollingFrame.Debug.Content.SettingsFrame.ScrollingFrame;


const DBW = new DragBarWidget("Change Time")
    .SetBounds(0, 24)
    .SetButtonIncrementDecrement(1)
    .SetUpdateCallback(() => {
        return Sunset.GetTime();
    })
    .SetActionCallback((Value) => {
        Sunset.SetTime(Value);
    })
    .Update();

new WidgetPage(DebugFrame)
    .AddWidget(DBW)
    .ShowWidgets();