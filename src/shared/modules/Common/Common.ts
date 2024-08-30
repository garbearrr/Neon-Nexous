import { Workspace } from "@rbxts/services";


export namespace Common {
    export const GetItemById = (ItemId: number): PossibleItems | undefined => {
        const IStr = tostring(ItemId);
        const CatNum = IStr.sub(1, 1);
        const Category = ItemCategories[CatNum];

        if (Category === undefined) {
            warn(`Invalid item id: ${ItemId}`);
            return;
        }

        const Items = Workspace.Items;
        const CatFolder = Items.WaitForChild(Category);

        if (CatFolder === undefined) {
            warn(`Category folder not found: ${Category}`);
            return;
        }

        const Item = CatFolder.WaitForChild(ItemId) as PossibleItems;
        if (Item === undefined) {
            warn(`Item not found: ${ItemId}`);
            return;
        }

        return Item;
    }

    const ItemCategories: ItemCategoriesType = {
        "1": "Droppers",
        "2": "Furnaces",
        "3": "Conveyors",
        "4": "Upgraders"
    }
}