import { Players } from "@rbxts/services";
import { WidgetManager } from "client/modules/UI/WidgetManager";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const ParentFrame = MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.ParentList.ScrollingFrame;
export const ParentWikiManager = new WidgetManager(ParentFrame);