import { Players } from "@rbxts/services";
import { WidgetPage } from "client/modules/UI/WidgetPage";
import { DebugWidgetManager } from "../debug";
import { MultiButtonWidget } from "client/modules/UI/MultiButtonWidget";
import { Inventory } from "client/modules/Inventory/Inventory";
import { Common } from "shared/modules/Common/Common";
import { DefaultItems } from "client/onload/Inventory/startingItems";
import { Money } from "client/modules/Money/Money";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";
import { DefaultMoney } from "client/onload/Money/starterMoney";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const DebugFrame = MainUI.MainFrame.Content.ScrollingFrame.Debug.Content.SettingsFrame.ScrollingFrame;

const Page = new WidgetPage("Poster", DebugFrame);

const GiveAll = new MultiButtonWidget("Items")
    .AddButton("Give All Items", (Button) => {
        Inventory.RemoveAllItems();

        const Items = Common.GetAllItems();
        for (const ID of Items.Keys()) {
            Inventory.AddItem(tonumber(ID)!, 99);
        }
    })
    .AddButton("Give Default Items", (Button) => {
        Inventory.RemoveAllItems();
        DefaultItems();
    });

const Currency = new MultiButtonWidget("Money")
    .AddButton("Infinite Money", (Button) => {
        Money.AddMoney(new BigNumber("1qa"), false);
    })
    .AddButton("Infinite Neon Crystals", (Button) => {
        Money.AddAltCurrency(new BigNumber("1qa"));
    })
    .AddButton("Default Money", (Button) => {
        Money.RemoveMoney(Money.GetMoney());
        DefaultMoney();
    })
    .AddButton("Default Neon Crystals", (Button) => {
        Money.RemoveAltCurrency(Money.GetAltCurrency());
    });

Page
    .AddWidget(GiveAll)
    .AddWidget(Currency)
    .ShowWidgets();


DebugWidgetManager.AddPage(Page);