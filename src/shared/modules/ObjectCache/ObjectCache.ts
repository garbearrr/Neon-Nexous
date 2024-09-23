import { ReplicatedStorage } from "@rbxts/services";


export class ObjectCache implements IObjectCache {

    private OC_Const = require(ReplicatedStorage.WaitForChild("ObjectCache") as ModuleScript) as ObjectCacheConstructor;
    private OC: IObjectCache;
    
    constructor(Template: BasePart | Model, CacheSize?: number, CachesContainer?: Folder) {
        this.OC = new this.OC_Const(Template, CacheSize, CachesContainer);
    }

    public GetPart(PartCFrame?: CFrame): BasePart {
        return this.OC.GetPart(PartCFrame);
    }

    public ReturnPart(Part: BasePart): void {
        this.OC.ReturnPart(Part);
    }

    public IsInUse(Part: BasePart): boolean {
        return this.OC.IsInUse(Part);
    }

    public Update(): void {
        this.OC.Update();
    }

    public ExpandCache(Amount: number): void {
        this.OC.ExpandCache(Amount);
    }

    public SetExpandAmount(Amount: number): void {
        this.OC.SetExpandAmount(Amount);
    }

    public Destroy(): void {
        this.OC.Destroy();
    }
}