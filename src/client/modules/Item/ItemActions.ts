import { Players } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { Money } from "../Money/Money";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";
import { PlacedItems } from "../Placement/PlacedItems";
import { Inventory } from "../Inventory/Inventory";

// TODO: Generalize to groups of items instead of a single item.
export namespace ItemActions {
    const Player = Players.LocalPlayer;
    const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
    const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
    const ActionUI = MainUI.WaitForChild("Bottom")?.WaitForChild("ItemActionInfo") as StarterGui["MainUI"]["Bottom"]["ItemActionInfo"];

    const Connections = new Collection<string, RBXScriptConnection>();
    const SelectedItems = new Collection<number, BaseItemType>();

    let ActionUIOpen = false;
    let UndoCb: Callback | undefined;

    export const HideUI = () => {
        ActionUI.Visible = false
        ActionUIOpen = false;
        UndoCb = undefined;
        SelectedItems.Clear();

        if (Connections.Size() > 0) {
            Connections.ForEach((C) => C.Disconnect());
            Connections.Clear();
        }
    }

    export const IsActionUIOpen = () => ActionUIOpen;

    const BuyAction = () => {
        // TODO: Generalize to groups of items instead of a single item.
        const Target = SelectedItems.At(0)!;
        const ItemID = Target.Stats.ItemId.Value;

        Money.BuyItem(ItemID);
    }

    const MoveAction = async () => {
        // TODO: Generalize to groups of items instead of a single item.
        const Target = SelectedItems.At(0)!;
        const ItemID = Target.Stats.ItemId.Value;
        // Item is destroyed here
        PlacedItems.RemoveItem(Target.GetPID());
        // Cir import fix
        const Mod = await import("../Placement/Placement");
        Inventory.AddItem(ItemID);
        Mod.Placement.Activate(ItemID);
        HideUI();
    }

    const SellAction = () => {
        SelectedItems.ForEach((Item) => {
            Money.AddMoney(new BigNumber(Item.Stats.Cost.Value));
            PlacedItems.RemoveItem(Item.GetPID());
        });
        HideUI();
    }

    const StoreAction = () => {
        SelectedItems.ForEach((Item) => {
            Inventory.AddItem(Item.Stats.ItemId.Value);
            PlacedItems.RemoveItem(Item.GetPID());
        });
        HideUI();
    }

    export const ShowActionsUI = (Item: BaseItemType, UndoCallback?: Callback) => {
        if (UndoCb !== undefined) UndoCb();
        
        ActionUI.Visible = true;
        ActionUI.Info.ItemName.Text = Item.Stats.ItemName.Value;
        ActionUI.Info.Actions.Visible = true;
        ActionUI.Info.UIListLayout.VerticalFlex = Enum.UIFlexAlignment.Fill;
        ActionUIOpen = true;
        SelectedItems.Set(Item.GetPID(), Item);
        UndoCb = UndoCallback;

        Connections.Set("buy", ActionUI.Info.Actions.Buy.Activated.Connect(() => BuyAction()));
        Connections.Set("sell", ActionUI.Info.Actions.Sell.Activated.Connect(() => SellAction()));
        Connections.Set("store", ActionUI.Info.Actions.Store.Activated.Connect(() => StoreAction()));
        Connections.Set("move", ActionUI.Info.Actions.Move.Activated.Connect(() => MoveAction()));
    }

    export const ShowBasicUI = (ItemName: string) => {
        ActionUI.Visible = true;
        ActionUI.Info.ItemName.Text = ItemName;
        ActionUI.Info.Actions.Visible = false;
        ActionUI.Info.UIListLayout.VerticalFlex = Enum.UIFlexAlignment.None;
    }
}