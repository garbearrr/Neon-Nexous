import { OreManager } from "./OreManager";

let oid = 0;

let money = 0;

export class Ore implements IOre {
    public readonly Dropper: DropperData;
    public readonly Ore: TemplateOre;
    public readonly OreId = oid++;
    private Value: number;

    public constructor(Dropper: DropperData, Ore: TemplateOre) {
        this.Dropper = Dropper;
        this.Ore = Ore;
        this.Value = Dropper.Stats.OreValue.Value;
    }

    public AddValue(Value: number): void {
        this.Value += Value;
    }

    public GetValue(): number {
        return this.Value;
    }

    public Process(): void {
        // TODO: Implement money system
        money += this.Value;
        print(`Money: ${money}`);
        this.Destroy();
    }

    public SetValue(Value: number): void {
        this.Value = Value;
    }

    public Destroy(): void {
        OreManager.Remove(this.OreId);
        this.Ore.Destroy();
    }
}