
import { itemModMap } from "ReplicatedStorage/client/item/helpers/itemModMap";
import { ClientItem } from "ReplicatedStorage/client/item/types";

export const getItemMod = (Item: ClientItem, placementId="0") => {
    const ItemMod = itemModMap(Item.Stats.ItemId.Value);
    return ItemMod(Item, placementId);
}