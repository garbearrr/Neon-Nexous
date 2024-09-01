import { TweenService } from "@rbxts/services";
import { Grid } from "../Grid/Grid";
import { Camera, Look, ViewDirection } from "../Camera/Camera";
import { Common } from "shared/modules/Common/Common";
import { Plot } from "../Plot/Plot";
import { Collection } from "@rbxgar/collection";
import { BaseItem } from "shared/modules/Item/BaseItem";
import { Conveyor } from "../Item/Conveyor";
import { Dropper } from "../Item/Dropper";
import { Furnace } from "../Item/Furnace";
import { Upgrader } from "../Item/Upgrader";

const ROT_SMOOTH = 0.75;
const CAM_TILT_PITCH = -45;

// TODO: When dragging, hide item guide and make the grid look like retail tycoon 2 drag grid.

let pid = 0;

// This is a namespace and not a singleton class because most other modules have setups 
// that need to run in the instance that it has not been instantiated yet.
// This is not the case here. If we were to use all namespaces instead of singletons, checks would need
// to be run at the start of every method in the namespace.

export namespace Placement {
    const State = {
        Active: false,
        CollisionGuide: undefined as unknown as Part,
        Connections: Collection<string, RBXScriptConnection>(),
        CurrentTween: undefined as unknown as Tween,
        DragCache: Collection<string, BaseItem>(),
        Item: undefined as unknown as PossibleItems,
        ItemId: 0,
        ItemModule: undefined as unknown as BaseItem,
        TweenIsMoving: false,
    }

    const TI = new TweenInfo(0.20, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);

    /**
     * Activate placement mode. If placement mode is already active the placement item will be updated if it is different.
     * @param ItemId Item id to place
     */
    export const Activate = (ItemId: number) => {
        const ItemData = Common.GetItemById(ItemId);
        if (ItemData === undefined) return;

        if (State.Active) {
            UpdateItem(ItemData, ItemId);
            return;
        }

        // This must be done before Item classes are instantiated.
        const G = Grid.Instance(Plot.PlotItem);

        State.Item = SetupClone(ItemData);
        State.ItemModule = ClassifyItem(State.Item);
        ConfigureHitboxGuide();

        State.ItemModule.OnSetup();

        // TODO: Configure collision guide
        const Conn = State.Connections;

        Conn.Set("grid_on_move", G.Events.OnMove.Connect(({ Pos, Rot }) => StartOrUpdateTween(Pos, Rot)));
        Conn.Set("grid_on_drag", G.Events.OnDrag.Connect(({ Added, CF }) => DragUpdate(Added, CF)));
        Conn.Set("grid_on_place", G.Events.OnPlace.Connect(({ CF }) => OnPlace(CF)));

        Camera.Instance().GetCamera().CFrame = Plot.CameraContainer.CFrame;
        
        Camera.Instance()
            .SetCameraContainer(Plot.CameraContainer)
            .SetOrientation(math.rad(CAM_TILT_PITCH), 0)
            .FlipMouseButtons(Enum.UserInputType.MouseButton2)
            .LockLookDirections(ViewDirection.Up, ViewDirection.Down)
            .SetLookVectors(Look.X, Look.Z)
            .UnSetLookVectors(Look.Y)
            .SetRotationSmoothness(ROT_SMOOTH);
        
        G.StartCasting(State.Item, ItemId);

        State.Active = true;
    }

    const ClassifyItem = (Item: PossibleItems): BaseItem => {
        if (Item.HasTag("Conveyor")) {
            return new Conveyor(Item as ConveyorTemplate);
        } else if (Item.HasTag("Dropper")) {
            return new Dropper(Item as DropperTemplate);
        } else if (Item.HasTag("Furnace")) {
            return new Furnace(Item as FurnaceTemplate);
        } else if (Item.HasTag("Upgrader")) {
            return new Upgrader(Item as UpgraderTemplate);
        } else {
            error("Item doesn't have a valid category tag: " + Item.Name);
        }
    };

    const ConfigureHitboxGuide = () => {
        if (State.CollisionGuide !== undefined) return;

        const HitBoxMarkGuide = new Instance("Part");
        HitBoxMarkGuide.Name = "HitBoxMarkGuide";
        HitBoxMarkGuide.Anchored = true;
        HitBoxMarkGuide.CanCollide = false;
        HitBoxMarkGuide.Parent = Plot.TempFolder;
        HitBoxMarkGuide.Transparency = 1;

        State.CollisionGuide = HitBoxMarkGuide;
    }

    /**
     * Deactivate placement mode and reset all states.
     * @param destoyTweenInstant Destroy the current tween instantly (optional)
     */
    export const Deactivate = (destoyTweenInstant = false) => {
        Camera.Instance().Reset();
        Grid.Instance().Reset();

        // Item will be destroyed by ItemModule.Destroy()
        State.Item = undefined as unknown as PossibleItems;

        State.ItemModule.Destroy();
        State.ItemModule = undefined as unknown as BaseItem;

        State.ItemId = 0;

        State.CollisionGuide.Destroy();
        State.CollisionGuide = undefined as unknown as Part;

        if (destoyTweenInstant) {
            State.CurrentTween?.Destroy();
            State.TweenIsMoving = false;
        }

        State.CurrentTween = undefined as unknown as Tween;

        State.Connections.ForEach(C => C.Disconnect());
        State.DragCache.Clear();

        State.Active = false;
    }

    const DragUpdate = (Added: boolean, CFrames: CFrame[]) => {
        if (Added) {
            for (const CF of CFrames) {
                const Clone = State.Item.Clone();
                Clone.Parent = Plot.TempFolder;
                Clone.CFrame = CF;
                Clone.Anchored = true;
    
                const Mod = ClassifyItem(Clone);
    
                Mod.OnSetup();
                Mod.OnDragged();
    
                const Tween = TweenService.Create(Clone as Part, TI, { Size: State.Item.Size });
                Tween.Completed.Connect(() => { 
                    Clone.Size = State.Item.Size;
                });
                Tween.Play();
    
                const Key = `${CF.Position.X},${CF.Position.Z}`;
                State.DragCache.Set(Key, Mod);
    
                // TODO: Come back to collision
                //if (!canPlaceItem(State, Clone.CollisionHitbox)){
                //    Clone.Transparency = 0.8;
                //    Clone.Color = CBC.CANT_PLACE_COLOR;
                //} else {
                    Clone.Transparency = 1;
                //}
            }
        } else {
            for (const CF of CFrames) {
                const Key = `${CF.Position.X},${CF.Position.Z}`;
                const I = State.DragCache.Get(Key);
    
                if (!I) continue;
    
                I.OnUndragged();
    
                State.DragCache.Delete(Key);
    
                const Tween = TweenService.Create(I.Part, TI, { Size: new Vector3(0, 0, 0) });
                Tween.Completed.Connect(() => I.Destroy());
                Tween.Play();
            }
        }
    }

    const OnPlace = (CF: CFrame[]) => {
        for (const Cframe of CF) {
            const Clone = State.Item.Clone();
            //Clone.CFrame = Cframe.mul(new CFrame(0, CBC.COLLISION_CHECK_Y_OFFSET, 0));
            Clone.Parent = Plot.PlacedFolder;
    
            // TODO: Come back to collision
            /* if (!canPlaceItem(State, Clone.CollisionHitbox, true)) {
                Clone.Destroy();
                print("Cant place item!")
                continue;
            } */
    
            const placementId = tostring(pid++);
            Clone.Name = tostring(placementId);
            
            const Mod = ClassifyItem(Clone);
    
            /*Clone.ClickDetector.MaxActivationDistance = 1000;
            Clone.ClickDetector.MouseHoverEnter.Connect((Player) => onMouseHoverEnter(Player, Clone));
            Clone.ClickDetector.MouseHoverLeave.Connect((Player) => onMouseHoverLeave(Player, Clone)); */
    
            /* _G.ItemPlaceCache.Set(
                placementId,
                Mod
            ); */
    
            Mod.OnPlaced();
    
            Clone.CFrame = Cframe;
            Clone.Transparency = 1;
        }
    
        State.DragCache.ForEach((Part) => {
            Part.Destroy();
        });
    
        State.DragCache.Clear();
    
        //State.InspectMod.UpdateBehavior();
    }

    const SetupClone = (Item: Part): PossibleItems => {
        const Clone = Item.Clone() as PossibleItems;
        Clone.Parent = Plot.TempFolder;
        Clone.Anchored = true;
        Clone.CanCollide = false;

        return Clone;
    }

    const StartOrUpdateTween = (Pos: Vector3, Rot: Vector3) => {
        if (!State.DragCache.IsEmpty()) return;

        if (State.CurrentTween)
            State.CurrentTween.Cancel();

        const TargetCFrame = new CFrame(Pos).mul(CFrame.Angles(
            Rot.X,
            Rot.Y,
            Rot.Z
        ));

        State.Item.CFrame = TargetCFrame;

        const Item = State.Item;
        State.ItemModule.OnMoved();

        const PosDiff = new Vector3 (
            Item.Position.X - Item.CollisionHitbox.Position.X,
            Item.Position.Y - Item.CollisionHitbox.Position.Y,
            Item.Position.Z - Item.CollisionHitbox.Position.Z
        );

        const TargetCHitbox = TargetCFrame.sub(PosDiff);

        State.CollisionGuide.Size = Item.CollisionHitbox.Size;
        State.CollisionGuide.CFrame = TargetCHitbox;

        // TODO: Come back to collision
        //if (!canPlaceItem(State, State.CollisionGuide)) {
        //    Item.Transparency = 0.8;
        //    Item.Color = CBC.CANT_PLACE_COLOR;
        //}
        //else {
            Item.Transparency = 1;
        //}

        State.CurrentTween = TweenService.Create(Item, TI, { CFrame: TargetCFrame });
        State.CurrentTween!.Play();
        State.CurrentTween!.Completed.Connect(() => {
            State.TweenIsMoving = false;
            State.CurrentTween = undefined as unknown as Tween;
        });
        State.TweenIsMoving = true;
    }

    /**
     * Toggle placement mode on/off.
     * @param ItemId Item id to place
     */
    export const Toggle = (ItemId: number) => {
        if (State.Active) {
            Deactivate();
        } else {
            Activate(ItemId);
        }
    }

    const UpdateItem = (Item: Part, ItemId: number) => {
        State.ItemId = ItemId;
        State.Item.Destroy();
        State.Item = SetupClone(Item);

        // TODO: Update collision guide

        Grid.Instance().StartCasting(State.Item, ItemId);
    }
}