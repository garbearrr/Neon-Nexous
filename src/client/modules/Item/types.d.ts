interface BaseItemData {
    readonly ClickDetector: ClickDetector;
    readonly CollisionHitbox: Part & {
        WeldConstraint: WeldConstraint;
        SelectionBox: SelectionBox;
    };
    readonly Model: Folder;
    readonly Stats: Folder & {
        ItemId: IntValue;
        Cost: StringValue;
        ItemName: StringValue;
        Icon: StringValue;
        Description: StringValue;
    };
}

interface IBaseItem {
    readonly ClickDetector: BaseItemData["ClickDetector"];
    readonly CollisionHitbox: BaseItemData["CollisionHitbox"];
    readonly Model: BaseItemData["Model"];
    readonly Stats: BaseItemData["Stats"];
    readonly Part: BaseItemData & Part;

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
        Cost: StringValue;
        Description: StringValue;
        Icon: StringValue;
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
        OreValue: StringValue;
        Cost: StringValue;
        Description: StringValue;
        Icon: StringValue;
        ItemName: StringValue;
    };
}

interface FurnaceData extends BaseItemData {
    Receiver: Part;
    Stats: Folder & {
        Add: StringValue;
        Cost: StringValue;
        Description: StringValue;
        MinOreValue: StringValue;
        MaxOreValue: StringValue;
        Multiplier: StringValue;
        ItemId: IntValue;
        Icon: StringValue;
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
        Add: StringValue;
        Cost: StringValue;
        Description: StringValue;
        MinOreValue: StringValue;
        MaxOreValue: StringValue;
        MaxUpgrades: NumberValue;
        Multiplier: NumberValue;
        ItemName: StringValue;
        Icon: StringValue;
        ItemId: IntValue;
    }
    Upgrade: Part & {
        WeldConstraint: WeldConstraint;
    }
}