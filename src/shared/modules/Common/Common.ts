import { Workspace } from "@rbxts/services";
import { Collection } from "../Collection/Collection";


export namespace Common {
    export const GetAllAltShopItems = (): ICollection<string, PossibleItems> => {
        const All = GetAllItems();
        return All.Filter((Item, _) => Item.Stats.InAltShop.Value > 0);
    }

    export const GetAllItems = (): Collection<string, PossibleItems> => {
        const FoundItems = new Collection<string, PossibleItems>();
        const Items = Workspace.FindFirstChild("Items") as Workspace["Items"];
        const TypeFolders = Items.GetChildren().filter(c => c.IsA("Folder")) as Folder[];

        for (const Folder of TypeFolders) {
            const Items = Folder.GetChildren() as PossibleItems[];

            for (const Item of Items) {
                const ID = Item.Name;
                FoundItems.Set(ID, Item);
            }
        }

        return FoundItems;
    }

    export const GetItemCategoryById = (ItemId: number): string | undefined => {
        const IStr = tostring(ItemId);
        const CatNum = IStr.sub(1, 1);
        return ItemCategories[CatNum];
    }
    
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