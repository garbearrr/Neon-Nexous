import { BaseItem } from "client/modules/Item/BaseItem";
import { Item } from "./Common";

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

    public override OnPlaced(): void {
        super.OnPlaced();

        this.Conveyor.DirectionIndicator.Enabled = false;

        const ConveyA1 = this.Conveyor.ConveyA1;
        const ConveyA2 = this.Conveyor.ConveyA2;
        const Speed = this.Conveyor.Speed.Value;
        const Part = this.Conveyor;

        Item.Common.ActivateConveyor(ConveyA1, ConveyA2, Speed, Part);

        const Conn = this.Upgrade.Touched.Connect((HitPart) => {
            // TODO: Ore upgrade logic
            /*
            const Ore = _G.OreCache.Get(HitPart.Name);

            if (Ore === undefined) return;

            Ore.Upgrade(State.Add, State.Multiplier, State.MinOreValue, State.MaxOreValue);
            */
        });

        this.Connections.push(Conn);
    }

    public override OnSetup(): void {
        super.OnSetup();
        
        this.Conveyor.DirectionIndicator.Enabled = true;
    }
}