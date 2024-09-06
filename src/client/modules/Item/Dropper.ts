import { BaseItem } from "client/modules/Item/BaseItem";

export class Dropper extends BaseItem implements DropperData {
    public readonly Drop: DropperData["Drop"];
    public readonly Ore: DropperData["Ore"];
    public readonly Stats: DropperData["Stats"];

    public constructor(Item: DropperData & Part) {
        super(Item);
        this.Drop = Item.Drop;
        this.Ore = Item.Ore;
        this.Stats = Item.Stats;
    }
}