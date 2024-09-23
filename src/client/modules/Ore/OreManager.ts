import { Collection } from "shared/modules/Collection/Collection";

export namespace OreManager {
    /** Key is ore id */
    const OreCache = new Collection<number, IOre>();

    export const Add = (Ore: IOre): void => {
        OreCache.Set(Ore.OreId, Ore);
    }

    export const Get = (OreId: number): IOre | undefined => {
        return OreCache.Get(OreId);
    }

    export const Remove = (OreId: number): boolean => {
        return OreCache.Delete(OreId);
    }
}