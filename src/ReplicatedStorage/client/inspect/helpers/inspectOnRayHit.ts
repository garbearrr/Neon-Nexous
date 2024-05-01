import { ActiveCast } from "@rbxgar/fastcast";
import { ClientInspectState } from "../types";
import { Players } from "@rbxts/services";
import { addItemToInventory } from "ReplicatedStorage/client/inventory/addItem";

const disconnectCon = (Con: RBXScriptConnection[]) => {
    for (const Connection of Con) {
        Connection.Disconnect();
    }
}

const Connections: RBXScriptConnection[] = [];

export const inspectOnRayHit = (
    State: ClientInspectState,
    _c: ActiveCast,
    result: RaycastResult,
    _v: Vector3, _b: Instance,
) => {
    const Hit = result.Instance;
    print(Hit);

    const Item = _G.ItemPlaceCache.Get(Hit.Name);
    print(Item?.Get("ItemId"));

    if (Item === undefined) return;

    const ItemActions = Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild("InspectActions") as ScreenGui;
    ItemActions.Enabled = true;

    const ItemName = ItemActions.WaitForChild("ItemName") as TextLabel;
    ItemName.Text = Item.Get("ItemName");

    const Frame = ItemActions.WaitForChild("Frame") as Frame;
    
    const Move = Frame.WaitForChild("Move") as TextButton;
    const Store = Frame.WaitForChild("Store") as TextButton;
    const Sell = Frame.WaitForChild("Sell") as TextButton;
    const Cancel = Frame.WaitForChild("Cancel") as TextButton;

    disconnectCon(Connections);

    Connections.push(Move.MouseButton1Click.Connect(() => {
        //Item.Move();
        ItemActions.Enabled = false;
        disconnectCon(Connections);
    }));

    Connections.push(Store.MouseButton1Click.Connect(() => {
        print("Storing item")
        addItemToInventory(Item.Get("ItemId"));
        _G.ItemPlaceCache.Delete(Item.Get("PlacementId"));
        Item.Destroy();
        ItemActions.Enabled = false;
        disconnectCon(Connections);
    }));

    Connections.push(Sell.MouseButton1Click.Connect(() => {
        print("Selling item")
        _G.Money += Item.Get("Cost");
        _G.ItemPlaceCache.Delete(Item.Get("PlacementId"));
        Item.Destroy();
        ItemActions.Enabled = false;
        disconnectCon(Connections);
    }));

    Connections.push(Cancel.MouseButton1Click.Connect(() => {
        ItemActions.Enabled = false;
        disconnectCon(Connections);
    }));

    if (State.VRToolEquipped === "Put Away") {
        _G.ItemPlaceCache.Delete(Item.Get("PlacementId"));
        Item.Destroy();
        ItemActions.Enabled = false;
        //disconnectCon(Connections);
    }

    if (State.VRToolEquipped === "Sell") {
        _G.Money += Item.Get("Cost");
        _G.ItemPlaceCache.Delete(Item.Get("PlacementId"));
        Item.Destroy();
        ItemActions.Enabled = false;
        //disconnectCon(Connections);
    }
}