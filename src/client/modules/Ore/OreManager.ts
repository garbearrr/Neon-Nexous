import { Collection } from "shared/modules/Collection/Collection";
import { Plot } from "../Plot/Plot";
import { CollectionService } from "@rbxts/services";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";

export namespace OreManager {
    /** Key is ore id */
    const OreCache = new Collection<number, IOre>();

    export const Add = (Ore: IOre): void => {
        OreCache.Set(Ore.OreId, Ore);
    }

    export const Get = (OreId: number): IOre | undefined => {
        return OreCache.Get(OreId);
    }

    export const FreezeOre = (): void => {
        OreCache.ForEach((Ore) => {
            Ore.Ore.Anchored = true;
        });
    }

    export const Remove = (OreId: number): boolean => {
        return OreCache.Delete(OreId);
    }

    const ListenOreCollisions = () => {
        Plot.PlotItem.Touched.Connect((Other) => {
            if (!CollectionService.HasTag(Other, "Ore")) return;
            const OID = Other.Name;

            Scheduling.SetTimeout(() => {
                const O = OreManager.Get(tonumber(OID) ?? -1);
                if (O === undefined) return;
                
                try {
                    O.Destroy();
                } catch (e) {}
                
                _G.Log(`Ore hit plot ${OID}`, "Plot|Ore");
            }, 0.1);
        });
    }

    export const UnfreezeOre = (): void => {
        OreCache.ForEach((Ore) => {
            Ore.Ore.Anchored = false;
        });
    }

    ListenOreCollisions();
}