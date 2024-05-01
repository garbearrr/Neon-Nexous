import { Players, ReplicatedStorage } from "@rbxts/services";
import { BuildEvents, BuildMethods, BuildModule, BuildOptions, BuildState } from "./types";
import { ActiveCast, FastCast, FastCastConstructor } from "@rbxgar/fastcast";
import { Grid } from "../grid/grid";
import { configureCastBehavior, getCellSkipAndCellOffset, getItemSizeInCellsXY, onRayHit } from "./helpers";
import { moduleGet } from "ReplicatedStorage/util/moduleGet";
import { DeclareModule } from "@rbxgar/basemodule";
import { EventModule } from "@rbxgar/event";
import { dragLock, enable, placeInputBegin, placeInputEnd, rotate } from "./methods";
import { BC } from "./constants";

// Persistant State
let rot = 0;

export function Build(ItemId: number, ItemSize: Vector3, opts?: BuildOptions): BuildModule {
    const FastCast = require(ReplicatedStorage.WaitForChild("FastCastRedux") as ModuleScript) as FastCast;

    const GM = opts?.GridModule || Grid(_G.plot.BuildModulePlot);

    const ItemSizeCells = getItemSizeInCellsXY(rot, ItemSize, GM.Get("GridTexture"));

    const [CellSkip, CellOffset] = getCellSkipAndCellOffset(ItemSizeCells, GM.Get("GridTexture"));

    const Mouse = Players.LocalPlayer.GetMouse();

    const Events: BuildEvents = {
        OnDrag: EventModule<{Added: boolean, CF: CFrame[]}>(),
        OnMove: EventModule<{ItemId: number, Pos: Vector3, Rot: Vector3}>(),
        OnPlace: EventModule<{ItemId: number, CF: CFrame[]}>(),
    }

    const State: BuildState = {
        CastBehavior:       opts?.CastBehavior || configureCastBehavior(FastCast, GM.Get("ParentGridPart")),
        Caster:             new (FastCast as unknown as FastCastConstructor)(),
        CellOffset:         CellOffset,
        CellSkip:           CellSkip,
        Connections:        [],
        Drag:               [],
        DragLockedHorizontal: false,
        DragLockedVertical: false,
        DragStart:          undefined,
        Enabled:            false,
        ItemContainer:      opts?.ItemContainer || GM.Get("ParentGridPart"),
        IsDestroyed:        false,
        ItemId:             ItemId,
        ItemSize:           ItemSize,
        ItemSizeCells:      ItemSizeCells,
        LastTargetCFrame:   new CFrame(),
        PlaceInputDown:     false,
        SnapSize:           opts?.SnapSize || BC.SNAP_SIZE,
    }

    const CastVelocity = opts?.CastVelocity || BC.CAST_VELOCITY;

    const FireSignal = (opts?.FireSignal || Mouse.Move);

    const CasterConnection = State.Caster.RayHit.Connect(
        (c: ActiveCast, r: RaycastResult, v: Vector3, b: Instance) =>
            onRayHit(State, GM, Events.OnMove, Events.OnDrag, rot, c, r, v, b)
    );

    State.Connections.push(CasterConnection);

    const Methods = (State: BuildState): BuildMethods => ({
        DragLock: (opts: {V?: boolean, H?: boolean}) => dragLock(State, opts),
        Enable: () => enable(State, FireSignal, CastVelocity),
        Get: moduleGet(State),
        GetRotation: () => rot,
        PlaceItem: (up = false) => {
            if (up) placeInputEnd(State, Events.OnPlace);
            else placeInputBegin(State);
        },
        Rotate: (rotation: number = 90) => {
            rot += rotation;
            if (rot >= 360) rot -= 360;
            rotate(State, GM.Get("GridTexture"), rot, CastVelocity)
        },
    });

    const IsDestroyed = () => State.IsDestroyed;

    const Mod = { ...Methods(State), IsDestroyed };

    const Destroy = () => {
        State.IsDestroyed = true;

        State.Connections.forEach((C) => C.Disconnect());

        GM.Destroy();

        for (const [Key, Event] of pairs(Events)) {
            Event.Destroy();
            //delete Event[Key as keyof BuildEvents];
        }

        for (const [Key] of pairs(Mod)) {
            if (Key === "IsDestroyed") continue;
            delete Mod[Key as keyof BuildMethods];
        }

        for (const [Key] of pairs(State)) {
            if (Key === "IsDestroyed") continue;
            delete State[Key as keyof BuildState];
        }
    }

    return DeclareModule({...Mod, Destroy, ...Events});
}