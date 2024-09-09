interface IOre {
    Dropper: DropperData;
    Ore: TemplateOre;
    OreId: number;

    AddValue(Value: number): void;
    GetValue(): number;
    Process(): void;
    SetValue(Value: number): void;
    Destroy(): void;
}

type TemplateOre = Omit<Workspace["Items"]["Droppers"]["10000"]["Ore"], "WeldConstraint">;