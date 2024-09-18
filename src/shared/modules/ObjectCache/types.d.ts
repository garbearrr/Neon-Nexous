interface IObjectCache {
    GetPart(PartCFrame?: CFrame): BasePart;
    ReturnPart(Part: BasePart): void;
    IsInUse(Part: BasePart): boolean;
    Update(): void;
    ExpandCache(Amount: number): void;
    SetExpandAmount(Amount: number): void;
    Destroy(): void;
}


type ObjectCacheConstructor = {
    new(
        Template: BasePart | Model,
        CacheSize: number | undefined,
        CachesContainer: Folder | undefined,
    ): IObjectCache
}