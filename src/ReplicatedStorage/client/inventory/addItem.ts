import { BaseClientItemModule, ClientItemModule } from "../item/types";

export const addItemToInventory = (Id: string) => {
    // Cast doesn't matter they all have ItemId
    const InventoryItem = _G.Inventory.Get(Id);

    if (!InventoryItem) {
        _G.Inventory.Set(Id, 1);
        return;
    }

    _G.Inventory.Set(Id, InventoryItem + 1);
}