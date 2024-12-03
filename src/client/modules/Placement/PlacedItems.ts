import { Collection } from "shared/modules/Collection/Collection";

export namespace PlacedItems {
    // Using the interface to avoid circular imports
    /** "CellX_CellY" -> ItemModule */
    const PlacedItemCache = new Collection<string, BaseItemType>();
    const PIDItemCache = new Collection<number, BaseItemType>();
    let pid = 0;

    /**
     * Activate hover for all placed items
     */
    export const ActivateHover = (): void => {
        PlacedItemCache.ForEach((Item) => {
            Item.ActivateClickDetector();
        });
    }

    /**
     * Adds an item to the PlacedItems cache
     * @param Cells The cells that the item occupies
     * @param Item The item to add
     */
    export const AddItem = (Cells: Vector2[], Item: BaseItemType): number => {
        if (Cells.size() === 0) {
            error("Cells must have at least one element. " + Item.Part.Name);
        }

        Cells.forEach(C => PlacedItemCache.Set(C.X + "_" + C.Y, Item));
        PIDItemCache.Set(pid, Item);
        return pid++;
    }

    /**
     * Checks in an item can be placed given placed items.
     * @param Cells The cells that the item occupies
     */
    export const CanPlace = (Cells: Vector2[]): boolean => {
        return Cells.every(C => PlacedItemCache.Get(C.X + "_" + C.Y) === undefined);
    }

    /**
     * Checks if an item can replace another item.
     * This is only true if the item is of the same type and the new item is completely contained within the old item.
     * @param Cells The cells that the item occupies
     * @param PlacingCat The category of the item being placed
     * @returns 
     */
    export const CanReplace = (Cells: Vector2[], PlacingCat: string): boolean => {
        const PIDCache = new Set<number>();
        return Cells.every(C => {
            const Item = PlacedItemCache.Get(C.X + "_" + C.Y);
            if (Item === undefined) return false;
            if (PIDCache.size() > 0 && !PIDCache.has(Item.GetPID())) return false;
            if (Item.GetCategory() !== PlacingCat) return false;

            PIDCache.add(Item.GetPID());
            return true;
        });
    }

    /**
     * Deactivates hover for all placed items
     */
    export const DeactivateHover = (): void => {
        PlacedItemCache.ForEach((Item) => {
            Item.DeactivateClickDetector();
        });
    }

    /** Get Item by PID */
    export const GetItem = (PID: number): BaseItemType | undefined => {
        return PIDItemCache.Get(PID);
    }

    /** Get unique items in cache */
    export const GetUniqueItems = (): ICollection<number, BaseItemType> => {
        return PIDItemCache;
    };

    export const HideHitboxes = (): void => {
        PlacedItemCache.ForEach((Item) => {
            Item.HideHitbox();
        });
    }

    export const RemoveItem = (PID: number): void => {
        const Keys = PlacedItemCache.FindKeys((v, k) => {
            if (v.GetPID() === PID) {
                return true;
            }
            return false;
        });

        PIDItemCache.Delete(PID);
        if (!Keys) return;

        const Mod = PlacedItemCache.Get(Keys[0]);
        Mod?.Destroy();

        Keys.forEach(K => PlacedItemCache.Delete(K));
    }

    export const ShowHitboxes = (): void => {
        PlacedItemCache.ForEach((Item) => {
            Item.ShowHitbox(false);
        });
    }
}