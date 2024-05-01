import { ReturnTypeBasedOnKey } from "../../../../types/util";
import { BaseModule } from "@rbxgar/basemodule";

interface BaseClientItem extends Part {
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

interface ClientConveyor extends BaseClientItem {
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

interface ClientDropper extends BaseClientItem {
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

interface ClientFurnace extends BaseClientItem {
    Receiver: Part;
    Stats: Folder & {
        Add: NumberValue;
        Cost: NumberValue;
        Multiplier: NumberValue;
        ItemId: IntValue;
        ItemName: StringValue;
    }
}

interface ClientUpgrader extends BaseClientItem {
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

interface ClientItemState {
    ClickDetector: ClickDetector;
    Cost: number;
    IsDestroyed: boolean;
    ItemId: string;
    ItemName: string;
    PhysicalItem: BaseClientItem;
    /**
     * Number associated with the unique placement id.
     */
    PlacementId: string;
    Type: "Conveyor" | "Dropper" | "Furnace" | "Upgrader";
}

interface ClientItemMethods {
    Get: <K extends keyof ClientItemState>(key: K) => Readonly<ReturnTypeBasedOnKey<ClientItemState, K>>;
    FireDragged: () => void;
    FireMoved: () => void;
    FirePlaced: () => void;
    FireRotated: () => void;
    FireSetup: () => void;
    FireUndragged: () => void;
    IsAConveyor: () => this is ClientConveyorModule;
    IsADropper: () => this is ClientDropperModule;
    IsAFurnace: () => this is ClientFurnaceModule;
    IsAnUpgrader: () => this is ClientUpgraderModule;
}

interface ClientItemEvents {

}

interface ClientConveyorState extends ClientItemState {
    PhysicalItem: ClientConveyor;
    Speed: number;
}

interface ClientConveyorMethods extends ClientItemMethods {
    Get: <K extends keyof ClientConveyorState>(key: K) => Readonly<ReturnTypeBasedOnKey<ClientConveyorState, K>>;
}

interface ClientConveyorEvents extends ClientItemEvents {}

type ClientConveyorModule = BaseModule & ClientConveyorMethods & ClientConveyorEvents;

interface ClientDropperState extends ClientItemState {
    DropAttachment: Attachment;
    DropSpeed: number;
    LastDropTime: number;
    Ore: Part & {WeldConstraint: WeldConstraint};
    OreValue: number;
    PhysicalItem: ClientDropper;
}

interface ClientDropperMethods extends ClientItemMethods {
    Get: <K extends keyof ClientDropperState>(key: K) => Readonly<ReturnTypeBasedOnKey<ClientDropperState, K>>;
    Drop: () => void;
}

interface ClientDropperEvents extends ClientItemEvents {}

type ClientDropperModule = BaseModule & ClientDropperMethods & ClientDropperEvents;

interface ClientFurnaceState extends ClientItemState {
    Add: number;
    Multiplier: number;
    PhysicalItem: ClientFurnace;
    Receiver: Part;
}

interface ClientFurnaceMethods extends ClientItemMethods {
    Get: <K extends keyof ClientFurnaceState>(key: K) => Readonly<ReturnTypeBasedOnKey<ClientFurnaceState, K>>;
}

interface ClientFurnaceEvents extends ClientItemEvents {}

type ClientFurnaceModule = BaseModule & ClientFurnaceMethods & ClientFurnaceEvents;

interface ClientUpgraderState extends ClientItemState {
    Add: number;
    Conveyor: Part;
    MinOreValue: number;
    MaxOreValue: number;
    Multiplier: number;
    PhysicalItem: ClientUpgrader;
    UpgradePart: Part;
}

interface ClientUpgraderMethods extends ClientItemMethods {
    Get: <K extends keyof ClientUpgraderState>(key: K) => Readonly<ReturnTypeBasedOnKey<ClientUpgraderState, K>>;
}

interface ClientUpgraderEvents extends ClientItemEvents {}

type ClientUpgraderModule = BaseModule & ClientUpgraderMethods & ClientUpgraderEvents;

type ClientItem = ClientConveyor | ClientDropper | ClientFurnace | ClientUpgrader;

type ClientItemModule = ClientConveyorModule | ClientDropperModule | ClientFurnaceModule | ClientUpgraderModule;

type BaseClientItemModule = BaseModule & ClientItemMethods & ClientItemEvents;