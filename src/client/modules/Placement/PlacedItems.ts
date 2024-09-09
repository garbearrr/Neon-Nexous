import { Collection } from "shared/modules/Collection/Collection";

export namespace PlacedItems {
    // Using the interface to avoid circular imports
    /** "CellX_CellY" -> ItemModule */
    const PlacedItemCache = Collection<string, BaseItemType>();
    let pid = 0;

    /**
     * Adds an item to the PlacedItems cache
     * @param Cells The cells that the item occupies
     * @param Item The item to add
     */
    export const AddItem = (Cells: Vector2[], Item: BaseItemType): number => {
        Cells.forEach(C => PlacedItemCache.Set(C.X + "_" + C.Y, Item));
        return pid++;
    }

    /**
     * Checks in an item can be placed given placed items.
     * @param Cells The cells that the item occupies
     */
    export const CanPlace = (Cells: Vector2[]): boolean => {
        return Cells.every(C => PlacedItemCache.Get(C.X + "_" + C.Y) === undefined);
    }

    /** Get unique items in cache */
    export const GetUniqueItems = (): Collection<string, BaseItemType> => {
        const PIDs = new Set<number>();
        return PlacedItemCache.Filter((Item, _) => {
            if (PIDs.has(Item.GetPID())) return false;
            PIDs.add(Item.GetPID());
            return true;
        });
    };

    export const RemoveItem = (PID: number): void => {
        const Keys = PlacedItemCache.FindKeys((v, k) => {
            if (v.GetPID() === PID) {
                return true;
            }
            return false;
        });

        if (!Keys) return;

        const Mod = PlacedItemCache.Get(Keys[0]);
        Mod?.Destroy();

        Keys.forEach(K => PlacedItemCache.Delete(K));
    }
}