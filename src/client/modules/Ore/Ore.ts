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
        _G.Log(`Added ${Value} to ${this.OreId}`, "Ore");
    }

    public GetValue(): BigNumber {
        return this.Value;
    }

    public Process(): void {
        // TODO: Implement money system
        Money.AddMoney(this.Value);
        _G.Log(`Processed ${this.Value} from ${this.OreId}`, "Ore");
        this.Destroy();
    }

    public SetValue(Value: BigNumber): void {
        this.Value = Value;
        _G.Log(`Set value of ${this.OreId} to ${Value}`, "Ore");
    }

    public Destroy(): void {
        OreManager.Remove(this.OreId);
        _G.Log(`Destroyed ${this.OreId}`, "Ore");
        this.Ore.Destroy();
    }
}