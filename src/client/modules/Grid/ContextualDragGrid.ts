import { BaseGrid } from "./BaseGrid";
import { OnMove, OnPlace } from "./EventClasses";

export class ContextualDragGrid extends BaseGrid {
    private nearbyConveyors: CFrame[];

    constructor(
        PState: { ParentGridPart: Part; Rotation: number },
        conveyors: CFrame[]
    ) {
        super(PState);
        this.nearbyConveyors = conveyors;
    }

    private GetInteractionRadius(): number {
        // Define how close a conveyor needs to be to influence the item
        return 10; // Example value, adjust as needed
    }    

    protected override OnRayHit(c: ActiveCast, res: RaycastResult, v: Vector3, b: Instance): void {
        super.OnRayHit(c, res, v, b);
    
        const mousePosition = new Vector3(res.Position.X, res.Position.Y, res.Position.Z);
    
        // Find the closest conveyor
        let closestConveyor: CFrame | undefined;
        let minDistance = math.huge;
    
        for (const conveyorCF of this.nearbyConveyors) {
            const distance = conveyorCF.Position.sub(mousePosition).Magnitude;
            if (distance < minDistance) {
                minDistance = distance;
                closestConveyor = conveyorCF;
            }
        }
    
        if (closestConveyor && minDistance <= this.GetInteractionRadius()) {
            // Rotate item towards conveyor
            const direction = closestConveyor.Position.sub(mousePosition).Unit;
            const rotationY = math.atan2(direction.X, direction.Z);
            const itemCFrame = new CFrame(mousePosition).mul(CFrame.Angles(0, rotationY, 0));
    
            this.LastTargetCFrame = itemCFrame;
            this.Events.OnMove.Fire(new OnMove(this.ItemId, mousePosition, new Vector3(0, rotationY, 0)));
        } else {
            // Default placement
            this.LastTargetCFrame = new CFrame(mousePosition);
            this.Events.OnMove.Fire(new OnMove(this.ItemId, mousePosition, new Vector3(0, this.PState.Rotation, 0)));
        }
    }
    
    protected override Place(): void {
        // Place the item at the calculated position and orientation
        //this.Events.OnPlace.Fire(new OnPlace(this.ItemId, [this.LastTargetCFrame]));
        //this.Drag = [];
    }
    
    public UpdateConveyors(conveyors: CFrame[]): void {
        this.nearbyConveyors = conveyors;
    }    
}
