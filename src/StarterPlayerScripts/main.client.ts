import { Players, ReplicatedFirst, StarterGui, Workspace } from "@rbxts/services";

const LoadEvent = ReplicatedFirst.WaitForChild("LoadEvent") as BindableEvent;
LoadEvent.Event.Wait();

import { ClientBuild } from "../ReplicatedStorage/client/build/mod"
import { Collection } from "@rbxgar/collection";
import { ClientItemModule } from "ReplicatedStorage/client/item/types";
import { ClientOreModule } from "ReplicatedStorage/client/ore/types";
import { setupVR } from "ReplicatedStorage/client/vr/setupvr";
import { ClientInventoryEntry } from "ReplicatedStorage/client/inventory/types";
import { ClientInspect } from "ReplicatedStorage/client/inspect/inspect";

// PROJECT
// TODO: Shop
// TODO: UI
// TODO: Item Generator
// TODO: Deleting/Moving Items (Selection System?)

// BUGS
// TODO: Drag placing upgrader horizonally makes every other one say not placeable. This doesn't happen vertically.

// AFTER PROJECT
// TODO: Revisit client build/placement module & collision.

const PlayerGUI = Players.LocalPlayer.WaitForChild("PlayerGui") as StarterGui;

_G.Inventory = Collection<string, number>();
_G.ItemPlaceCache = Collection<string, ClientItemModule>();
_G.OreCache = Collection<string, ClientOreModule>();
_G.MoneyText = PlayerGUI.Money.MoneyFrame.MoneyText;
_G.Money = 0;
_G.VR = false;

//TODO: NOTE! VR is current disabled in studio settings.

const Item = Workspace.Items.Conveyors.Conveyor["30000"];
//const Item = Workspace.Items.Droppers["Starter Dropper"]["10000"];

const inVR = setupVR();

if (inVR === false) {
    const ClientInspectMod = ClientInspect();
    ClientInspectMod.Enable();

    const ClientB = ClientBuild(Item, ClientInspectMod);
    ClientB.Activate();
}

while (true) {
    for (const Item of _G.ItemPlaceCache.Values()) {
        if (!Item.IsADropper()) continue;
        Item.Drop();
    }

    wait(0.1);  // Check every 0.1 seconds
}
