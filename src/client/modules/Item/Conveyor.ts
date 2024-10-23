import { BaseItem } from "client/modules/Item/BaseItem";
import { Item } from "./Common";
import { BuildModes, Grid } from "../Grid/Grid";


export class Conveyor extends BaseItem implements ConveyorData {
    public readonly BeamA1: ConveyorData["BeamA1"];
    public readonly BeamA2: ConveyorData["BeamA2"];
    public readonly ConveyA1: ConveyorData["ConveyA1"];
    public readonly ConveyA2: ConveyorData["ConveyA2"];
    public readonly DirectionIndicator: ConveyorData["DirectionIndicator"];
    public readonly Stats: ConveyorData["Stats"];

    public constructor(Item: ConveyorData & Part) {
        super(Item);
        this.BeamA1 = Item.BeamA1;
        this.BeamA2 = Item.BeamA2;
        this.ConveyA1 = Item.ConveyA1;
        this.ConveyA2 = Item.ConveyA2;
        this.DirectionIndicator = Item.DirectionIndicator;
        this.Stats = Item.Stats;

        const C = Grid.GetGlobalInstance().Events.OnRotate.Connect((Rot) => this.OnRotated(Rot));
        this.Connections.Set("OnRotate", C);
    }

    protected override ActionClickUndo(): void {
        super.ActionClickUndo();
        this.DirectionIndicator.Enabled = false;
    }

    protected override CDMouseClick(Player: Player): void {
        super.CDMouseClick(Player);
        this.DirectionIndicator.Enabled = true;
    }

    protected override CDMouseHoverEnter(Player: Player): void {
        super.CDMouseHoverEnter(Player);
        this.DirectionIndicator.Enabled = true;
    }

    protected override CDMouseHoverLeave(Player: Player): void {
        super.CDMouseHoverLeave(Player);
        if (this.IsActionClicked) return;
        this.DirectionIndicator.Enabled = false;
    }

    public override DeactivateClickDetector(): void {
        super.DeactivateClickDetector();
        this.DirectionIndicator.Enabled = false;
    }

    public override GetBuildModeType(): keyof BuildModes {
        return "AnchorDragGrid";
    }

    public override OnPlaced(): void {
        super.OnPlaced();

        this.DirectionIndicator.Enabled = false;
        
        const ConveyorA1 = this.ConveyA1;
        const ConveyorA2 = this.ConveyA2;
        const Speed = this.Stats.Speed.Value;
        const Part = this.CollisionHitbox;

        Item.Common.ActivateConveyor(ConveyorA1, ConveyorA2, Speed, Part);
    }

    private OnRotated(Rot: number): void {
        (Rot === 0 || Rot === 180)
            ? Grid.GetGlobalInstance().LockDragVertical()
            : Grid.GetGlobalInstance().LockDragHorizontal();
    }

    public override OnSetup(): void {
        super.OnSetup();
        
        this.DirectionIndicator.Enabled = true;

        const G = Grid.GetGlobalInstance();
        const Rot = G.GetItemRotation();

        (Rot === 0 || Rot === 180) 
            ? G.LockDragVertical()
            : G.LockDragHorizontal();
    }
}