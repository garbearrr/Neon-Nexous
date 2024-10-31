import { Players } from "@rbxts/services";
import { WidgetManager } from "client/modules/UI/WidgetManager";


//Debug.Enable();

//DebugItemImaging.Activate();

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const DebugList = MainUI.MainFrame.Content.ScrollingFrame.Debug.Content.List.ScrollingFrame;

export const DebugWidgetManager = new WidgetManager(DebugList);