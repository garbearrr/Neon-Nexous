import { BaseItem } from "client/modules/Item/BaseItem";
import { Collection } from "shared/modules/Collection/Collection";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";
import { Plot } from "../Plot/Plot";

/**
 * Outer Collection Key: Interval in seconds between drops.
 * 
 * Inner Collection Key: PID of the dropper.
 */
export const DropperTimings = Collection<number, Collection<number, DropLink>>();

export class Dropper extends BaseItem implements DropperData {
    public readonly Drop: DropperData["Drop"];
    public readonly Ore: DropperData["Ore"];
    public readonly Stats: DropperData["Stats"];

    private DropLink?: DropLink;

    public constructor(Item: DropperData & Part) {
        super(Item);
        this.Drop = Item.Drop;
        this.Ore = Item.Ore;
        this.Stats = Item.Stats;
    }

    public GetDropLink(): DropLink | undefined {
        return this.DropLink;
    }

    public override Destroy(): void {
        this.DropLink?.Stop();
        super.Destroy();
    }

    public override OnPlaced(): void {
        super.OnPlaced();
        this.DropLink = new DropLink(this);
    }
}

// TODO: remove and reimplement in ore module:
const TEMP_DROP = (Link: DropLink) => {
    const Clone = Link.Dropper.Ore.Clone();
    Clone.WeldConstraint.Destroy();
    Clone.Parent = Plot.OreFolder;
    Clone.CFrame = Link.Dropper.Drop.WorldCFrame;
    Clone.Anchored = false;
    Clone.CanCollide = true;
    Clone.CanTouch = true;
}

const BeginDropInterval = (TimingCache: Collection<number, DropLink>, Timing: number): () => void => {
    return Scheduling.SetInterval(() => {
        TimingCache.ForEach((Link, _PID) => {
            TEMP_DROP(Link);
            print("Dropped");
        });
    }, Timing);
};

class DropLink {
    public readonly Dropper: Dropper;
    public readonly PID: number;
    public readonly Timing: number;

    private Cleanup: () => void = () => {};

    public constructor(Dropper: Dropper) {
        this.Dropper = Dropper;
        this.PID = Dropper.GetPID();
        this.Timing = Dropper.Stats.DropSpeed.Value;

        this.Setup();
    }
    
    /** Get the cleanup function for this dropper. Not directly callable. */
    public GetCleanup(): never {
        return this.Cleanup as never;
    }

    private Setup(): void {
        const CommonInterval = DropperTimings.Get(this.Timing);
        if (CommonInterval === undefined) {
            const DL = DropperTimings.Set(this.Timing, Collection());
            DL.Set(this.PID, this);
            this.Cleanup = BeginDropInterval(DL, this.Timing);
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