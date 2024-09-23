import { BigNumber } from "shared/modules/BigNumber/BigNumber";
import { OreManager } from "./OreManager";
import { Money } from "../Money/Money";

let oid = 0;

export class Ore implements IOre {
    public readonly Dropper: DropperData;
    public readonly Ore: TemplateOre;
    public readonly OreId = oid++;
    private Value: BigNumber;

    public constructor(Dropper: DropperData, Ore: TemplateOre) {
        this.Dropper = Dropper;
        this.Ore = Ore;
        this.Value = new BigNumber(Dropper.Stats.OreValue.Value);
    }

    public AddValue(Value: BigNumber): void {
        this.Value = this.Value.Add(Value);
    }

    public GetValue(): BigNumber {
        return this.Value;
    }

    public Process(): void {
        // TODO: Implement money system
        Money.AddMoney(this.Value);
        this.Destroy();
    }

    public SetValue(Value: BigNumber): void {
        this.Value = Value;
    }

    public Destroy(): void {
        OreManager.Remove(this.OreId);
        this.Ore.Destroy();
    }
}