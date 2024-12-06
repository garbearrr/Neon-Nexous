import { BaseItem } from "client/modules/Item/BaseItem";
import { Item } from "./Common";
import { CollectionService } from "@rbxts/services";
import { OreManager } from "../Ore/OreManager";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";

export class Upgrader extends BaseItem implements UpgraderData {
    public readonly Conveyor: UpgraderData["Conveyor"];
    public readonly Stats: UpgraderData["Stats"];
    public readonly Upgrade: Part & { WeldConstraint: WeldConstraint; };

    public constructor(Item: UpgraderData & Part) {
        super(Item);
        this.Conveyor = Item.Conveyor;
        this.Stats = Item.Stats;
        this.Upgrade = Item.Upgrade;
    }

    protected override ActionClickUndo(): void {
        super.ActionClickUndo();
        this.Conveyor.DirectionIndicator.Enabled = false;
    }

    protected override CDMouseClick(Player: Player): void {
        super.CDMouseClick(Player);
        this.Conveyor.DirectionIndicator.Enabled = true;
    }

    protected override CDMouseHoverEnter(Player: Player): void {
        super.CDMouseHoverEnter(Player);
        this.Conveyor.DirectionIndicator.Enabled = true;
    }

    protected override CDMouseHoverLeave(Player: Player): void {
        super.CDMouseHoverLeave(Player);
        if (this.IsActionClicked) return;
        this.Conveyor.DirectionIndicator.Enabled = false;
    }

    public override DeactivateClickDetector(): void {
        super.DeactivateClickDetector();
        this.Conveyor.DirectionIndicator.Enabled = false;
    }

    public override OnPlaced(): void {
        super.OnPlaced();
        if (this.Destroyed) return;

        this.Conveyor.DirectionIndicator.Enabled = false;

        const ConveyA1 = this.Conveyor.ConveyA1;
        const ConveyA2 = this.Conveyor.ConveyA2;
        const Speed = this.Conveyor.Speed.Value;
        const Part = this.Conveyor;

        Item.Common.ActivateConveyor(ConveyA1, ConveyA2, Speed, Part);

        const Conn = this.Upgrade.Touched.Connect((HitPart) => {
            if (!CollectionService.HasTag(HitPart, "Ore")) return;

            const Ore = OreManager.Get(tonumber(HitPart.Name)!);
            if (Ore === undefined) return;
            
            this.UpgradeOre(Ore);

            // TODO: Implement tagging system.
        });

        this.Connections.Set("upgrade_touched", Conn);
    }

    public override OnSetup(): void {
        super.OnSetup();
        
        this.Conveyor.DirectionIndicator.Enabled = true;
    }

    private UpgradeOre(Ore: IOre): void {
        const CurValue = Ore.GetValue();
        const MinValueAccepted = new BigNumber(this.Stats.MinOreValue.Value);
        const MaxValueAccepted = new BigNumber(this.Stats.MaxOreValue.Value);
        const MaxUpgrades = this.Stats.MaxUpgrades.Value;
        const UpgradeCount = Ore.GetUpgradeCount();

        // If the ore value is less than the min value accepted or greater than the max value accepted, return.
        if (MinValueAccepted.ToNumber() !== -1 && CurValue.IsLessThan(MinValueAccepted)) return;
        if (MaxValueAccepted.ToNumber() !== -1 && CurValue.IsGreaterThan(MaxValueAccepted)) return;

        const AdjustedCount = (MaxUpgrades === 0) ? UpgradeCount - 1 : UpgradeCount;

        // If the upgrade count is greater than the max upgrades, return.
        if (MaxUpgrades !== -1 && AdjustedCount >= MaxUpgrades) return;

        // Add ore value then multiply by the multiplier.
        const NewValue = CurValue
            .Add(new BigNumber(this.Stats.Add.Value))
            .Multiply(new BigNumber(this.Stats.Multiplier.Value));

        Ore.AddUpgrade();
            
        Ore.SetValue(NewValue);
    }
}