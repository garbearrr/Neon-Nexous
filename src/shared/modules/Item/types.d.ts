interface BaseItemData {
    ClickDetector: ClickDetector;
    CollisionHitbox: Part & {
        WeldConstraint: WeldConstraint;
    };
    Model: Folder;
    Stats: Folder & {
        ItemId: IntValue;
        Cost: NumberValue;
        ItemName: StringValue;
    };
}

interface ConveyorData extends BaseItemData {
    BeamA1: Attachment;
    BeamA2: Attachment;
    ConveyA1: Attachment;
    ConveyA2: Attachment;
    DirectionIndicator: Beam;
    Stats: Folder & {
        Speed: NumberValue;
        ItemId: IntValue;
        Cost: NumberValue;
        ItemName: StringValue;
    };
}

interface DropperData extends BaseItemData {
    Drop: Attachment;
    Ore: Part & {
        WeldConstraint: WeldConstraint;
    };
    Stats: Folder & {
        ItemId: IntValue;
        DropSpeed: NumberValue;
        OreValue: NumberValue;
        Cost: NumberValue;
        ItemName: StringValue;
    };
}

interface FurnaceData extends BaseItemData {
    Receiver: Part;
    Stats: Folder & {
        Add: NumberValue;
        Cost: NumberValue;
        Multiplier: NumberValue;
        ItemId: IntValue;
        ItemName: StringValue;
    }
}

interface UpgraderData extends BaseItemData {
    Conveyor: Part & {
        BeamA1: Attachment;
        BeamA2: Attachment;
        ConveyA1: Attachment;
        ConveyA2: Attachment;
        DirectionIndicator: Beam;
        Speed: NumberValue;
        WeldConstraint: WeldConstraint;
    }
    Stats: Folder & {
        Add: NumberValue;
        Cost: NumberValue;
        MinOreValue: NumberValue;
        MaxOreValue: NumberValue;
        Multiplier: NumberValue;
        ItemName: StringValue;
        ItemId: IntValue;
    }
    Upgrade: Part & {
        WeldConstraint: WeldConstraint;
    }
}