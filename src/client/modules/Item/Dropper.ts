import { BaseItem } from "client/modules/Item/BaseItem";
import { Collection } from "shared/modules/Collection/Collection";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";
import { Plot } from "../Plot/Plot";
import { Ore } from "../Ore/Ore";
import { CollectionService } from "@rbxts/services";
import { OreManager } from "../Ore/OreManager";
import { ItemFacingDirection } from "./Common";
import { Grid } from "../Grid/Grid";

/**
 * Outer Collection Key: Interval in seconds between drops.
 * 
 * Inner Collection Key: PID of the dropper.
 */
export const DropperTimings = new Collection<number, Collection<number, DropLink>>();

export class Dropper extends BaseItem implements DropperData {
    public readonly Drop: DropperData["Drop"];
    public readonly Ore: DropperData["Ore"];
    public readonly Stats: DropperData["Stats"];

    private DropLink?: DropLink;
    private static AllPaused = false;

    public constructor(Item: DropperData & Part) {
        super(Item);
        this.Drop = Item.Drop;
        this.Ore = Item.Ore;
        this.Stats = Item.Stats;
    }

    public static AreDroppersPaused(): boolean {
        return Dropper.AllPaused;
    }

    public override AsModel(): Model {
        const Clone = this.Part.Clone() as DropperData & Part;
        Clone.Ore.Destroy();

        const Model = new Instance("Model");
        Clone.Parent = Model;
        Model.PrimaryPart = Clone.CollisionHitbox;
        return Model;
    }

    private static BeginDropInterval(TimingCache: Collection<number, DropLink>, Timing: number): () => void {
        return Scheduling.SetInterval(() => {
            TimingCache.ForEach((Link, _PID) => {
                Dropper.DropOre(Link);
            });
        }, Timing);
    }

    public GetDropLink(): DropLink | undefined {
        return this.DropLink;
    }

    public override GetFacingDirection(): ItemFacingDirection | undefined {
        switch (Grid.GetGlobalInstance().GetItemRotation()) {
            case 0:
                return ItemFacingDirection.East;
            case 90:
                return ItemFacingDirection.North;
            case 180:
                return ItemFacingDirection.West;
            case 270:
                return ItemFacingDirection.South;
            default:
                return ItemFacingDirection.North;
        }
    }

    public override Destroy(DestroyPart = true): void {
        this.DropLink?.Stop();
        super.Destroy(DestroyPart);
    }

    private static DropOre(Link: DropLink): void {
        if (Dropper.AllPaused) return;

        const Clone = Link.Dropper.Ore.Clone();
        Clone.WeldConstraint.Destroy();
        Clone.Parent = Plot.OreFolder;
        Clone.CFrame = Link.Dropper.Drop.WorldCFrame;
        Clone.Anchored = false;
        Clone.CanCollide = true;
        Clone.CanTouch = true;

        CollectionService.AddTag(Clone, "Ore");

        const NewOre = new Ore(Link.Dropper, Clone);
        OreManager.Add(NewOre);

        Clone.Name = tostring(NewOre.OreId);
    }

    public override OnPlaced(): void {
        super.OnPlaced();
        if (this.Destroyed) return;
        this.DropLink = new DropLink(this, (TimingCache, Timing) => Dropper.BeginDropInterval(TimingCache, Timing));
    }

    public static PauseAllDroppers(): void {
        Dropper.AllPaused = true;
    }

    public static ResumeAllDroppers(): void {
        Dropper.AllPaused = false;
    }
}

class DropLink {
    public readonly Dropper: Dropper;
    public readonly PID: number;
    public readonly Timing: number;

    private Cleanup: () => void = () => {};
    private StartDInterval: (TimingCache: Collection<number, DropLink>, Timing: number) => () => void;

    public constructor(Dropper: Dropper, DInt: Callback) {
        this.Dropper = Dropper;
        this.PID = Dropper.GetPID();
        this.Timing = Dropper.Stats.DropSpeed.Value;

        this.StartDInterval = DInt;
        this.Setup();
    }

    /** Get the cleanup function for this dropper. Not directly callable. */
    public GetCleanup(): never {
        return this.Cleanup as never;
    }

    private Setup(): void {
        const CommonInterval = DropperTimings.Get(this.Timing);
        if (CommonInterval === undefined) {
            const DL = DropperTimings.Set(this.Timing, new Collection());
            DL.Set(this.PID, this);
            this.Cleanup = this.StartDInterval(DL, this.Timing);
            return;
        }

        this.Cleanup = (CommonInterval!.First() as DropLink).GetCleanup();
        CommonInterval.Set(this.PID, this);
    }
    
    /** Stop the drop interval for this dropper. */
    public Stop(): void {
        DropperTimings.Get(this.Timing)?.Delete(this.PID);

        if (DropperTimings.Get(this.Timing)?.Size() === 0) {
            DropperTimings.Delete(this.Timing);
            this.Cleanup();
        }
    }
}