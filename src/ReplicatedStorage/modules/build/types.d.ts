import { FastCastConstructor, FastCastBehavior } from "@rbxgar/fastcast";
import { BaseModule } from "@rbxgar/basemodule";
import { GridModule } from "../grid/types";
import { ReturnTypeBasedOnKey } from "../../../../types/util";
import { EventModule } from "@rbxgar/event";

interface BuildState {
    /**
     * FastCast behavior for the current build mode.
     */
    CastBehavior:       FastCastBehavior;
    /**
     * FastCast instance for the current build mode.
     */
    Caster:             InstanceType<FastCastConstructor>;
    /**
     * Determines the offset of the item from the center of a cell.
     */
    CellOffset:         Vector2;
    /**
     * Determines the clamp of the item on the item from the edges of the grid.
     */
    CellSkip:           Vector2;
    /**
     * All event connections.
     * 
     * Make sure to disconnect when build mode is disabled.
     */
    Connections:        RBXScriptConnection[];
    /**
     * This tracks which items are in the dragging zone.
     * 
     * The boolean marks whether or not it was the first value added.
     */
    Drag:               CFrame[];
    /**
     * If the drag is locked the X axis.
     */
    DragLockedHorizontal: boolean;
    /**
     * If the drag is locked the Y axis.
     */
    DragLockedVertical: boolean;
    /**
     * Position at which the drag was initiated.
     */
    DragStart?:         Vector2;
    Enabled:            boolean;
    IsDestroyed:        boolean;
    /**
     * The instance where the cloned items will be placed for updating cast filter.
     */
    ItemContainer:      Instance;
    /**
     * The id of the item being placed.
     */
    ItemId:             number;
    /**
     * The dimensions of the item being placed.
     */
    ItemSize:           Vector3;
    /**
     * The dimensions of the item being placed in cells.
     */
    ItemSizeCells:      Vector2;
    /**
     * The last target CFrame.
     */
    LastTargetCFrame:   CFrame;
    /**
     * If the item place button is down.
     */
    PlaceInputDown:     boolean;
    /**
     * How many "sub" cells items will snap to.
     * 
     * The result is 1 / 2^N. Ex: Snapsize 1 = 1/2 cells.
     */
    SnapSize: number;
}

interface BuildEvents {
    /**
     * Fires on drag.
     * 
     * If added is true, the size increased.
     * 
     * If it's false, the size decreased.
     */
    OnDrag: EventModule<{Added: boolean, CF: CFrame[]}>;
    /**
     * Fires when the item is placed.
     * [ItemId, Position, Orientation]
     */
    OnMove: EventModule<{ItemId: number, Pos: Vector3, Rot: Vector3}>;
    /**
     * Fires when the item is placed.
     */
    OnPlace: EventModule<{ItemId: number, CF: CFrame[]}>;
}

interface BuildOptions {
    /**
     * FastCast behavior for the current build mode.
     */
    CastBehavior?: FastCastBehavior;
    /**
     * How fast the casts will move.
     */
    CastVelocity?: number;
    /**
     * Grid Module for access to grid functions.
     */
    GridModule?: GridModule;
    /**
     * The signal to fire raycasts. Default on mouse move.
     */
    FireSignal?: RBXScriptSignal;
    /**
     * The instance where the cloned items will be placed for updating cast filter.
     */
    ItemContainer?: Instance;
    /**
     * How many "sub" cells items will snap to.
     * 
     * The result is 1 / 2^N. Ex: Snapsize 1 = 1/2 cells.
     */
    SnapSize?: number;
}

interface BuildMethods {
    /**
     * Locks dragging to a certain axis. Horizontal or vertical.
     */
    DragLock: (opts: {V?: boolean, H?: boolean}) => void;
    /**
     * Enables build mode.
     */
    Enable: () => void;
    /**
     * General get method
     */
    Get: <K extends keyof BuildState>(key: K) => Readonly<ReturnTypeBasedOnKey<BuildState, K>>;
    GetRotation: () => number;
    /**
     * Placing input. If up is true, then the item will be placed.
     * 
     * If it is down, the item will be start to be dragged.
     */
    PlaceItem: (up?: boolean) => void;
    /**
     * Rotate item by rotation degrees.
     */
    Rotate: (rotation?: number) => void;
}

type BuildModule = BaseModule & BuildMethods & BuildEvents;