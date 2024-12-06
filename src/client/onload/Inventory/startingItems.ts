import { Inventory } from "client/modules/Inventory/Inventory";


export const DefaultItems = () => {
    Inventory.AddItem(10000, 1);
    Inventory.AddItem(20000, 1);
    Inventory.AddItem(30000, 15);
    Inventory.AddItem(40000, 1);
}

DefaultItems();