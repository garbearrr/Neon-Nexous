interface IOre {
    Dropper: DropperData;
    Ore: TemplateOre;
    OreId: number;

    AddUpgrade(): void;
    AddValue(Value: iBigNumber): void;
    GetUpgradeCount(): number;
    GetValue(): iBigNumber;
    Process(): void;
    SetValue(Value: iBigNumber): void;
    Destroy(): void;
}

type TemplateOre = Omit<Workspace["Items"]["Droppers"]["10000"]["Ore"], "WeldConstraint">;