import { TweenService, Workspace } from "@rbxts/services";
import { Camera, Look, ViewDirection } from "../Camera/Camera";
import { Common } from "shared/modules/Common/Common";
import { Plot } from "../Plot/Plot";
import { BaseItem } from "client/modules/Item/BaseItem";
import { Conveyor } from "../Item/Conveyor";
import { Dropper } from "../Item/Dropper";
import { Furnace } from "../Item/Furnace";
import { Upgrader } from "../Item/Upgrader";
import { Collection } from "shared/modules/Collection/Collection";
import { Grid } from "../Grid/Grid";
import { ObjectCache } from "shared/modules/ObjectCache/ObjectCache";
import { PlacedItems } from "./PlacedItems";
import { LinkedListCollection } from "shared/modules/LinkedList/LinkedList";
import { Inventory } from "../Inventory/Inventory";

const ROT_SMOOTH = 0.75;
const CAM_TILT_PITCH = -45;
const CACHE_SIZE = 10;

let pid = 0;

// This is a namespace and not a singleton class because most other modules have setups 
// that need to run in the instance that it has not been instantiated yet.
// This is not the case here. If we were to use all namespaces instead of singletons, checks would need
// to be run at the start of every method in the namespace.

export namespace Placement {
    const State = {
        Active: false,
        CollisionGuide: undefined as unknown as Part,
        Connections: new Collection<string, RBXScriptConnection>(),
        CurrentTween: undefined as unknown as Tween,
        DragCache: new Collection<string, BaseItem>(),
        HideGuide: false,
        Item: undefined as unknown as PossibleItems,
        ItemId: 0,
        ItemModule: undefined as unknown as BaseItem,
        ManagerMode: false,
        ObjectCache: undefined as unknown as IObjectCache,
        Paused: false,
        SimpleDrag: false,
        SimplePlace: false,
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

        State.Item = SetupClone(ItemData);

        State.ObjectCache = new ObjectCache(ItemData, CACHE_SIZE /*Grid.GetGlobalInstance().MaxItemsPossible(State.Item)*/);
        Workspace.FindFirstChild("ObjectCache")!.ChildRemoved.Connect((child) => {
            print("ObjectCache child removed " + child.Name);
        });

        State.ItemModule = ClassifyItem(State.Item);

        const G = Grid.Instance(State.ItemModule.GetBuildModeType(), Plot.PlotItem);

        ConfigureHitboxGuide();

        State.ItemModule.OnSetup();

        const Conn = State.Connections;

        Conn.Set("grid_on_move", G.Events.OnMove.Connect(({ Pos, Rot }) => StartOrUpdateTween(Pos, Rot)));
        //Conn.Set("grid_on_drag", G.Events.OnDrag.Connect(({ Added, CF }) => DragUpdate(Added, CF)));
        Conn.Set("grid_on_place", G.Events.OnPlace.Connect(({ CF }) => OnPlace(CF)));
        Conn.Set("grid_on_update", G.Events.OnUpdate.Connect(({ CF }) => OnUpdate(CF)));

        if (!State.ManagerMode) {
            CamSetup();
        }

        State.ManagerMode = false;
        
        G.ToggleGrid(true);
        G.StartCasting(State.Item, ItemId);

        PlacedItems.DeactivateHover();
        PlacedItems.ShowHitboxes();
        State.ItemModule.ShowHitbox();

        State.Active = true;
        State.ItemId = ItemId;
    }

    export const ActivateManager = () => {
        CamSetup();

        PlacedItems.ActivateHover();
        Grid.GetGlobalInstance().ToggleGrid(true);

        State.ManagerMode = true;
    }

    const CamSetup = () => {
        Camera.Instance().GetCamera().CFrame = Camera.PersistantCamCF || Plot.CameraContainer.CFrame;
        const [Pitch, Yaw] = Camera.PersistantPitchYaw || [math.rad(CAM_TILT_PITCH), 0];
        
        Camera.Instance()
            .SetCameraContainer(Plot.CameraContainer)
            .SetContainerDisregard(false)
            .FlipMouseButtons(Enum.UserInputType.MouseButton2)
            .LockLookDirections(ViewDirection.Up, ViewDirection.Down)
            .SetLookVectors(Look.X, Look.Z)
            .UnSetLookVectors(Look.Y)
            .SetRotationSmoothness(ROT_SMOOTH)
            .SetOrientation(Pitch, Yaw);
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
        _G.Log("Deactivating placement mode", "Placement");
        Camera.Instance().Reset();

        PlacedItems.DeactivateHover();

        Grid.GetGlobalInstance().ToggleGrid(false);

        if (State.ManagerMode) {
            PlacedItems.HideHitboxes();
            State.ManagerMode = false;
            return;
        }

        Grid.GetGlobalInstance().CleanUp();

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

        State.ObjectCache.Destroy();
        State.ObjectCache = undefined as unknown as IObjectCache;

        PlacedItems.HideHitboxes();

        State.Active = false;
        State.Paused = false;
        State.HideGuide = false;
    }

    export const PausePlacement = () => {
        State.HideGuide = true;
        State.Paused = true;
    }

    export const IsActive = () => State.Active;

    const OnPlace = (CF: LinkedListCollection<string, CFrame>) => {
        if (State.Paused) return;

        CF.ForEachWithKey((Cframe, _Key, _Index) => {
            const Clone = State.Item.Clone();
            Clone.CFrame = Cframe;
    
            const placementId = tostring(pid++);
            Clone.Name = tostring(placementId);
            
            const Mod = ClassifyItem(Clone);
            Mod.ShowHitbox();
            Mod.OnPlaced();
    
            Clone.CFrame = Cframe;
            Clone.Transparency = 1;
        });
    
        State.DragCache.ForEach((Part) => {
            Part.Destroy(false);
            State.ObjectCache.ReturnPart(Part.Part);
        });
    
        State.DragCache.Clear();

        //DragGrid.Instance().DestroyCells();

        State.HideGuide = false;
    
        //State.InspectMod.UpdateBehavior();
    }

    const OnUpdate = (CFrames: LinkedListCollection<string, CFrame>) => {
        if (CFrames.GetSize() === State.DragCache.Size()) return;
        if (State.Paused) return;

        const InvAmount = Inventory.GetItem(State.ItemId);
        const FrameCache = new Collection<string, BaseItem>();
        const CellSize = Grid.GetGlobalInstance().GetCellSize();

        CFrames.ForEachWithKey((CF, _Key, Index) => {
            const position = CF.Position;
            const GridX = math.floor(position.X / CellSize + 0.5); // Round to nearest integer
            const GridZ = math.floor(position.Z / CellSize + 0.5);
            const Key = `${GridX},${GridZ},${CF.ToEulerAnglesXYZ()[1]}`;
            let Mod: BaseItem;
    
            if (State.DragCache.Has(Key)) {
                // The item already exists; update its position if needed.
                Mod = State.DragCache.Get(Key)!;
                // If you need to update the position, you can do it here.
                // Mod.Part.CFrame = CF; // Not necessary if position hasn't changed
            } else {
                // Create a new item since it doesn't exist at this position.
                const Clone = State.ObjectCache.GetPart() as PossibleItems;
                // Sometimes is destroyed?
                Mod = ClassifyItem(Clone);
                Mod.ShowHitbox();

                Clone.CFrame = CF;
    
                Mod.OnSetup();
                Mod.OnDragged();
            }
    
            print("Index: " + Index + " InvAmount: " + InvAmount);
            if (InvAmount === undefined || Index >= InvAmount) {
                Mod.SetOutOfItems(true);
                Mod.ChangeBoxColor();
            }

            FrameCache.Set(Key, Mod);
        });
    
        // Clean up any parts that are no longer needed.
        State.DragCache.ForEach((Mod, Key) => {
            if (!FrameCache.Has(Key)) {
                Mod.OnUndragged();
                State.ObjectCache.ReturnPart(Mod.Part);
                Mod.Destroy(false);
            }
        });
    
        // Update the drag cache for the next frame.
        State.DragCache = FrameCache;
    }
    
    

    /**
     * Set simple drag mode on/off. Simple drag mode uses GUI instead of 3D models.
     * @param SimpleDrag 
     */
    export const SetSimpleDrag = (SimpleDrag: boolean) => {
        State.SimpleDrag = SimpleDrag;
    }

    /**
     * Set simple place mode on/off. Simple place mode uses GUI instead of 3D models.
     * @param SimplePlace
     */
    export const SetSimplePlace = (SimplePlace: boolean) => {
        State.SimplePlace = SimplePlace;
    }

    const SetupClone = (Item: Part): PossibleItems => {
        const Clone = Item.Clone() as PossibleItems;
        Clone.Parent = Plot.TempFolder;
        Clone.Anchored = true;
        Clone.CanCollide = false;

        return Clone;
    }

    const StartOrUpdateTween = (Pos: Vector3, Rot: Vector3) => {
        if (!State.DragCache.IsEmpty()) {
            State.Item.CFrame = new CFrame(State.Item.Position.X, -50, State.Item.Position.Z);
            return;
        };

        if (State.CurrentTween)
            State.CurrentTween.Cancel();

        const HideAdjust = new CFrame (
            Pos.X,
            Pos.Y + (State.HideGuide ? -100 : 0),
            Pos.Z
        )

        const TargetCFrame = HideAdjust.mul(CFrame.Angles(
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

    export const UnpausePlacement = () => {
        State.HideGuide = false;
        State.Paused = false;
    }

    const UpdateItem = (Item: Part, ItemId: number) => {
        State.ItemId = ItemId;
        State.Item.Destroy();
        State.Item = SetupClone(Item);

        for (const Item of State.DragCache.Values()) {
            Item.Destroy(false);
        }

        State.DragCache.Clear();

        State.ObjectCache.Destroy();
        State.ObjectCache = new ObjectCache(Item, CACHE_SIZE /*Grid.GetGlobalInstance().MaxItemsPossible(State.Item)*/);

        while (Grid.GetGlobalInstance().IsPlaceButtonDown()) wait();
        Grid.Instance("SquareDragGrid", Plot.PlotItem).StartCasting(State.Item, ItemId);
    }
}