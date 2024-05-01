import { BaseClientItemModule, ClientConveyorModule, ClientItemModule } from "../item/types";


export const removeItemFromInventory = (Item: BaseClientItemModule) => {
    // Cast doesn't matter they all have ItemId
    const Id = Item.Get("ItemId");
    const InventoryItem = _G.Inventory.Get(Id);

    if (!InventoryItem) {
        return;
    }

    InventoryItem.Amount--;

    if (InventoryItem.Amount === 0) {
        _G.Inventory.Delete(Id);
    }
}