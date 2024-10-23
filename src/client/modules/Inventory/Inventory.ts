import { Collection } from "shared/modules/Collection/Collection";

export namespace Inventory {
    // ItemID, Amount
    const Inv = new Collection<string, number>();

    export const AddItem = (ItemID: string, Amount = 1) => {
        if (Inv.Has(ItemID)) {
            Inv.Set(ItemID, Inv.Get(ItemID)! + Amount);
        } else {
            Inv.Set(ItemID, Amount);
        }
    }

    export const HasItem = (ItemID: string, Amount = 1) => {
        return Inv.Has(ItemID) && Inv.Get(ItemID)! >= Amount;
    }

    export const RemoveItem = (ItemID: string, Amount = 1) => {
        if (!Inv.Has(ItemID)) return;

        Inv.Set(ItemID, Inv.Get(ItemID)! - Amount);
        if (Inv.Get(ItemID)! <= 0) {
            Inv.Delete(ItemID);
        }
    }
}