import { Players } from "@rbxts/services";
import { WidgetPage } from "client/modules/UI/WidgetPage";
import { AddWikiEntry } from "../addWikiEntry";
import { WikiWidget } from "client/modules/UI/WikiWidget";
import { Input } from "client/modules/Input/Input";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const Entry = AddWikiEntry("Currency");

const NeonCrystals = new WidgetPage("Neon Crystals", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
NeonCrystals.AddWidget(
    new WikiWidget("Neon Crystals")
        .AddLine(`Neon Crystals are the secondary currency in Neon Nexous. You can use them to buy powerful items from the crystal uplink at the top of the mountain. Earn Neon Crystals by leveling up. Money earned directly translate to XP.`)
);
Entry.AddPage(NeonCrystals).AddIconToLastButton("http://www.roblox.com/asset/?id=123179551300837");