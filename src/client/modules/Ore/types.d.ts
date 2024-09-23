interface IOre {
    Dropper: DropperData;
    Ore: TemplateOre;
    OreId: number;

    AddValue(Value: iBigNumber): void;
    GetValue(): iBigNumber;
    Process(): void;
    SetValue(Value: iBigNumber): void;
    Destroy(): void;
}

type TemplateOre = Omit<Workspace["Items"]["Droppers"]["10000"]["Ore"], "WeldConstraint">;