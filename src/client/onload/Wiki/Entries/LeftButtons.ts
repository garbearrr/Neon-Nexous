import { Players } from "@rbxts/services";
import { WidgetPage } from "client/modules/UI/WidgetPage";
import { AddWikiEntry } from "../addWikiEntry";
import { WikiWidget } from "client/modules/UI/WikiWidget";
import { Input } from "client/modules/Input/Input";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const Entry = AddWikiEntry("Left Buttons");

const ItemManager = new WidgetPage("Item Manager", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
ItemManager.AddWidget(
    new WikiWidget("Item Manager")
        .AddLine(`The Item Manager is where you can view all of the items in your tycoon.`)
        .AddLine(`You can select an item to perform the following actions:`)
        .AddLine(`- Move: Move the item to a different location.`)
        .AddLine(`- Store: Store the item in your inventory.`)
        .AddLine(`- Sell: Sell the item for money.`)
        .AddLine(`- Buy: Buy another item of the same type.`)
        .AddImage("http://www.roblox.com/asset/?id=85078115372920", 96, 387)
        .AddLine(`The Item Manager can also be opened using ${Input.C2S(Input.Controls.KeyboardMouse.ToggleBuild)}`)
);
Entry
    .AddPage(ItemManager)
    .AddIconToLastButton("http://www.roblox.com/asset/?id=84531773266094");

const Inventory = new WidgetPage("Inventory", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
Inventory.AddWidget(
    new WikiWidget("Inventory")
        .AddLine(`The Inventory is where you can view all of the items you own and select items to place on your plot.`)
        .AddLine(`The number in the bottom corner of each item represents the quantity of that item you own.`)
        .AddLine(`The Inventory can also be opened using ${Input.C2S(Input.Controls.KeyboardMouse.ToggleInventory)}`)
);
Entry
    .AddPage(Inventory)
    .AddIconToLastButton("http://www.roblox.com/asset/?id=116370444440149");


const Shop = new WidgetPage("Shop", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
Shop.AddWidget(
    new WikiWidget("Shop")
        .AddLine(`The Shop is where you can buy items to place on your plot.`)
        .AddLine(`The Shop can also be opened using ${Input.C2S(Input.Controls.KeyboardMouse.ToggleShop)}`)
);
Entry
    .AddPage(Shop)
    .AddIconToLastButton("http://www.roblox.com/asset/?id=134682495974329");

const Settings = new WidgetPage("Settings", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
Settings.AddWidget(
    new WikiWidget("Settings")
        .AddLine(`The Settings menu is where you can change game-specific settings.`)
        .AddLine(`This is current a placeholder page and does not contain any settings.`)
);
Entry
    .AddPage(Settings)
    .AddIconToLastButton("http://www.roblox.com/asset/?id=123358158355913");

const Wiki = new WidgetPage("Wiki", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
Wiki.AddWidget(
    new WikiWidget("Wiki")
        .AddLine(`The Wiki is where you can view information about the game.`)
        .AddLine(`You already found this one.`)
);
Entry
    .AddPage(Wiki)
    .AddIconToLastButton("http://www.roblox.com/asset/?id=95443447215487");
