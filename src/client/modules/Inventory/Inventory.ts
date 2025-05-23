import { Collection } from "shared/modules/Collection/Collection";

export namespace Inventory {
    // ItemID, Amount
    const Inv = new Collection<number, number>();

    export const AddItem = (ItemID: number, Amount = 1) => {
        if (Inv.Has(ItemID)) {
            Inv.Set(ItemID, Inv.Get(ItemID)! + Amount);
        } else {
            Inv.Set(ItemID, Amount);
        }
        _G.Log(`Added ${Amount} of ${ItemID} to inventory`, "Inventory");
    }

    export const GetAllItems = () => {
        return Inv;
    }

    export const GetItem = (ItemID: number) => {
        return Inv.Get(ItemID);
    }

    export const HasItem = (ItemID: number, Amount = 1) => {
        return Inv.Has(ItemID) && Inv.Get(ItemID)! >= Amount;
    }

    export const RemoveAllItems = () => {
        Inv.Clear();
        _G.Log(`Removed all items from inventory`, "Inventory");
    }

    export const RemoveItem = (ItemID: number, Amount = 1) => {
        if (!Inv.Has(ItemID)) return;

        Inv.Set(ItemID, Inv.Get(ItemID)! - Amount);
        if (Inv.Get(ItemID)! <= 0) {
            Inv.Delete(ItemID);
        }
        _G.Log(`Removed ${Amount} of ${ItemID} from inventory`, "Inventory");
    }
}