interface BaseItemData {
    readonly ClickDetector: ClickDetector;
    readonly CollisionHitbox: Part & {
        WeldConstraint: WeldConstraint;
        SelectionBox: SelectionBox;
    };
    readonly Model: Folder;
    readonly Stats: Folder & {
        ItemId: IntValue;
        Cost: NumberValue;
        ItemName: StringValue;
    };
}

interface IBaseItem {
    ActivateClickDetector(): void
    AsModel(): Model
    DeactivateClickDetector(): void
    Destroy(): void
    GetCategory(): string
    GetPID(): number
    HideHitbox(): void
    /** Fires when the item is being dragged during placement. */
    OnDragged(): void
    /** Fires when the items is moved during placement. */
    OnMoved(): void
    /** Fires when the item is placed. */
    OnPlaced(): void
    /** Fires when the item is selected for placement and casting begins. */
    OnSetup(): void
    /** Fires when the item is removed from a drag. */
    OnUndragged(): void
    ShowHitbox(withBorder?: boolean): void
}

interface BaseItemType extends BaseItemData, IBaseItem {}

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