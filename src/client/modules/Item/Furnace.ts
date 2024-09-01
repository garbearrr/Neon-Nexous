import { BaseItem } from "shared/modules/Item/BaseItem";

export class Furnace extends BaseItem implements FurnaceData {
    public readonly Receiver: Part;
    public readonly Stats: FurnaceData["Stats"];

    public constructor(Item: FurnaceData & Part) {
        super(Item);
        this.Receiver = Item.Receiver;
        this.Stats = Item.Stats;
    }

    public override OnPlaced(): void {
        super.OnPlaced();
        
        const Conn = this.Receiver.Touched.Connect((HitPart) => {
            // TODO: Ore smelting logic
            /*
            const Ore = _G.OreCache.Get(HitPart.Name);

            if (Ore === undefined) return;

            Ore.Process(State.Add, State.Multiplier);
            _G.OreCache.Delete(HitPart.Name);
            Ore.Destroy()
            */
        });

        this.Connections.push(Conn);
    }
}