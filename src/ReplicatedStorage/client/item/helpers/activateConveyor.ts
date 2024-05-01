
export const activateConveyor = (ConveyA1: Attachment, ConveyA2: Attachment, Speed: number, Conveyor: Part) => {
    const Direction = ConveyA2.WorldPosition.sub(ConveyA1.WorldPosition).Unit;
    Conveyor.AssemblyLinearVelocity = Direction.mul(Speed);
}