import { Players } from "@rbxts/services";
import { WidgetPage } from "client/modules/UI/WidgetPage";
import { AddWikiEntry } from "../addWikiEntry";
import { WikiWidget } from "client/modules/UI/WikiWidget";
import { Input } from "client/modules/Input/Input";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const Entry = AddWikiEntry("Overview");

const GettingStarted = new WidgetPage("Getting Started", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
GettingStarted.AddWidget(
    new WikiWidget("Getting Started")
        .AddLine(`Welcome to Neon Nexous!`)
        .AddLine(`To get started, follow these steps:`)
        .AddLine(`1. Open your inventory by pressing the inventory button or by pressing ${Input.C2S(Input.Controls.KeyboardMouse.ToggleInventory)}.`)
        .AddImage("http://www.roblox.com/asset/?id=116370444440149", 64, 64)
        .AddLine(`2. Select the "Ore Processor" furnace from your inventory and place it on your plot.`)
        .AddLine(`3. Reopen the inventory and select the "Conveyor". Place them in the direction of the furnace. You may need to rotate them using ${Input.C2S(Input.Controls.KeyboardMouse.GridItemRotate)}.`)
        .AddLine(`4. Reopen the inventory one more time and select the "Erbium Mine" and place it with its spout facing one of your conveyors.`)
        .AddLine(`5. You can now start making money! Exit build mode by pressing ${Input.C2S(Input.Controls.KeyboardMouse.ToggleBuild)}.`)
);
Entry.AddPage(GettingStarted);

const Goal = new WidgetPage("Goal", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
Goal.AddWidget(
    new WikiWidget("Goal")
        .AddLine(`The goal of Neon Nexous is to make as much money as possible by designing your own tycoon with the limited resources given to you.`)
        .AddLine(`Discover new ways to make money and expand your tycoon to make even more money.`)
        .AddImage("http://www.roblox.com/asset/?id=71870963299346", 256, 256)
);
Entry.AddPage(Goal);

const Credits = new WidgetPage("Credits", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
Credits.AddWidget(
    new WikiWidget("Credits")
        .AddLine(`Credits to the following people for their contributions to Neon Nexous:`)
        .AddLine(`- [Developer] - Garrett Weaver`)
        .AddLine(`- [Developer] - Parker Cummins`)
        .AddLine(`- [Developer] - Kush Patel`)
        .AddLine(`- Andrew Bereza (@berezaagames) for the original game concept: Miners Haven`)
        .AddLine(`Thank you to all testers:`)
        .AddLine(`Haylee, Andrew, Jacob, Nick`)
        .AddLine(`S/o WP, Bowling, & Stickbugs`)
);
Entry.AddPage(Credits);