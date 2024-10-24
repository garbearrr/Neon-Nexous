import { BigNumber } from "shared/modules/BigNumber/BigNumber";
import { OreManager } from "./OreManager";
import { Money } from "../Money/Money";
import { CollectionService, Workspace } from "@rbxts/services";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";

let oid = 0;

const OreStuckTests = 3;
const OreStuckInterval = 2; // Seconds
const ValidStuckTags = ["Conveyor", "Upgrader"];

export class Ore implements IOre {
    public readonly Dropper: DropperData;
    public readonly Ore: TemplateOre;
    public readonly OreId = oid++;

    private Cleanup: () => void = () => {};
    private readonly RaycastParams = new RaycastParams();
    private Stucks = 0;
    private Value: BigNumber;

    public constructor(Dropper: DropperData, Ore: TemplateOre) {
        this.Dropper = Dropper;
        this.Ore = Ore;
        this.Value = new BigNumber(Dropper.Stats.OreValue.Value);

        this.RaycastParams.FilterType = Enum.RaycastFilterType.Exclude;
        this.RaycastParams.FilterDescendantsInstances = [this.Ore];

        this.StartOreRayCheck();
    }

    public AddValue(Value: BigNumber): void {
        this.Value = this.Value.Add(Value);
        this.Stucks = 0;
        _G.Log(`Added ${Value} to ${this.OreId}`, "Ore");
    }

    public GetValue(): BigNumber {
        return this.Value;
    }

    public Process(): void {
        Money.AddMoney(this.Value);
        _G.Log(`Processed ${this.Value} from ${this.OreId}`, "Ore");
        this.Destroy();
    }

    public SetValue(Value: BigNumber): void {
        this.Value = Value;
        this.Stucks = 0;
        _G.Log(`Set value of ${this.OreId} to ${Value}`, "Ore");
    }

    public Destroy(): void {
        OreManager.Remove(this.OreId);
        _G.Log(`Destroyed ${this.OreId}`, "Ore");
        this.Ore.Destroy();
        this.Cleanup?.();
    }

    private FireRayAtOre(): void {
         // Create a ray going directly downward from the ore's position
        const RayOrigin = this.Ore.Position;
        const RayDirection = new Vector3(0, -10, 0); // 10 studs down

        const RayResult = Workspace.Raycast(RayOrigin, RayDirection);

        if (RayResult !== undefined) {
            const HitPart = RayResult.Instance;

            const IsValid = ValidStuckTags.some((Tag) => {
                if (CollectionService.HasTag(HitPart, Tag)) {
                    return true;
                }
                return false;
            });

            if (IsValid) {
                this.Stucks = 0;
                return;
            }
            
            this.Stucks++;
            _G.Log(`Ore ${this.OreId} is stuck tries ${this.Stucks}`, "Ore");
            if (this.Stucks >= OreStuckTests) {
                this.Destroy();
            }
            
        } else {
            // No part was hit, meaning ore is likely off the plot
            // this.Destroy();
        }
    }

    private StartOreRayCheck(): void {
        this.Cleanup = Scheduling.SetInterval(() => {
            this.FireRayAtOre();
        }, OreStuckInterval);
    }
}