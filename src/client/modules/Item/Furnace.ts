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
        
        const Conn = this.Receiver.Touched.Connect((HitPart) => {
            if (!CollectionService.HasTag(HitPart, "Ore")) return;

            const Ore = OreManager.Get(tonumber(HitPart.Name)!);
            if (Ore === undefined) return;

            const CurValue = Ore.GetValue();
            const NewValue = CurValue
                .Multiply(new BigNumber(this.Stats.Multiplier.Value))
                .Add(new BigNumber(this.Stats.Add.Value));

            Ore.SetValue(NewValue);
            Ore.Process();
        });

        this.Connections.push(Conn);
    }
}