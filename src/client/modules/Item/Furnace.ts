import { CollectionService } from "@rbxts/services";
import { BaseItem } from "client/modules/Item/BaseItem";
import { OreManager } from "../Ore/OreManager";
import { ItemFacingDirection } from "./Common";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";

export class Furnace extends BaseItem implements FurnaceData {
    public readonly Receiver: Part;
    public readonly Stats: FurnaceData["Stats"];

    public constructor(Item: FurnaceData & Part) {
        super(Item);
        this.Receiver = Item.Receiver;
        this.Stats = Item.Stats;
    }

    public override GetFacingDirection(): ItemFacingDirection | undefined {
        return;
    }

    public override OnPlaced(): void {
        super.OnPlaced();
        if (this.Destroyed) return;
        
        const Conn = this.Receiver.Touched.Connect((HitPart) => {
            if (!CollectionService.HasTag(HitPart, "Ore")) return;

            const Ore = OreManager.Get(tonumber(HitPart.Name)!);
            if (Ore === undefined) return;

            this.ProcessOre(Ore);
        });

        this.Connections.Set("receiver_touch", Conn);
    }

    private ProcessOre(Ore: IOre): void {
        const CurValue = Ore.GetValue();
        const MinValueAccepted = new BigNumber(this.Stats.MinOreValue.Value);
        const MaxValueAccepted = new BigNumber(this.Stats.MaxOreValue.Value);
        const MaxUpgrades = this.Stats.MaxUpgrades.Value;
        const UpgradeCount = Ore.GetUpgradeCount();

        // If the ore value is less than the min value accepted or greater than the max value accepted, return.
        if (MinValueAccepted.ToNumber() !== -1 && CurValue.IsLessThan(MinValueAccepted)) {
            Ore.Destroy();
            return;
        }

        if (MaxValueAccepted.ToNumber() !== -1 && CurValue.IsGreaterThan(MaxValueAccepted)) {
            Ore.Destroy();
            return;
        }

        // Accounts for unupgraded cases
        const AdjustedCount = (MaxUpgrades === 0) ? UpgradeCount - 1 : UpgradeCount;

        // If the upgrade count is greater than the max upgrades, return.
        if (MaxUpgrades !== -1 && AdjustedCount >= MaxUpgrades) {
            Ore.Destroy();
            return;
        }

        // Add then multiply ore value.
        const NewValue = CurValue
            .Add(new BigNumber(this.Stats.Add.Value))
            .Multiply(new BigNumber(this.Stats.Multiplier.Value));

        Ore.SetValue(NewValue);
        Ore.Process();
    }
}
