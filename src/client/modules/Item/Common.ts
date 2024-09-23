

export namespace Item.Common {
    export const ActivateConveyor = (ConveyA1: Attachment, ConveyA2: Attachment, Speed: number, Conveyor: Part) => {
        const Direction = ConveyA2.WorldPosition.sub(ConveyA1.WorldPosition).Unit;
        Conveyor.AssemblyLinearVelocity = Direction.mul(Speed);
    }
}

export enum ItemFacingDirection {
    North,
    East,
    South,
    West
}