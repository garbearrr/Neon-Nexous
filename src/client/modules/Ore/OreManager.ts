import { Collection } from "shared/modules/Collection/Collection";
import { Plot } from "../Plot/Plot";
import { CollectionService } from "@rbxts/services";

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

    const ListenOreCollisions = () => {
        Plot.PlotItem.Touched.Connect((Other) => {
            if (!CollectionService.HasTag(Other, "Ore")) return;
            const OID = Other.Name;
            OreManager.Get(tonumber(OID) || -1)?.Destroy();
            _G.Log(`Ore hit plot ${OID}`, "Plot|Ore");
        });
    }

    ListenOreCollisions();
}