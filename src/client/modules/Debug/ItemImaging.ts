//import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
//import { Collection } from "shared/modules/Collection/Collection";
//import { Common } from "shared/modules/Common/Common";
//import { Plot } from "../Plot/Plot";

/*
export namespace DebugItemImaging {
    const Base = Workspace.ItemImaging.ItemImageLoc;
    const CamFollow = Workspace.ItemImaging.CamFollow;
    const Camera = Workspace.CurrentCamera!;
    const Connections = new Collection<string, RBXScriptConnection>();
    const Items = Common.GetAllItems();
    const OGBaseCFrame = Base.CFrame;
    const PlayerLastPos = Players.LocalPlayer.Character?.PrimaryPart?.Position;

    const Controls = {
        NextItem: Enum.KeyCode.Right,
        PrevItem: Enum.KeyCode.Left,
        Exit: Enum.KeyCode.Backspace,
        RaiseBase: Enum.KeyCode.Up,
        LowerBase: Enum.KeyCode.Down,
        IncreaseRadius: Enum.KeyCode.Equals,
        DecreaseRadius: Enum.KeyCode.Minus,
        RotateRight: Enum.KeyCode.D,
        RotateLeft: Enum.KeyCode.A,
        RotateUp: Enum.KeyCode.W,
        RotateDown: Enum.KeyCode.S,
        RotateItemXInc: Enum.KeyCode.O,
        RotateItemXDec: Enum.KeyCode.I,
        RotateItemYInc: Enum.KeyCode.K,
        RotateItemYDec: Enum.KeyCode.J,
        RotateItemZInc: Enum.KeyCode.M,
        RotateItemZDec: Enum.KeyCode.N,
    }

    let ItemIdx = 0;
    let CurrentItem: PossibleItems | undefined;
    let BaseCFrame: CFrame = Base.CFrame; // To keep track of base transformations

    export const Activate = () => {
        Camera.CameraType = Enum.CameraType.Scriptable;

        const character = Players.LocalPlayer.Character;
        if (character && character.PrimaryPart) {
            character.MoveTo(Workspace.ItemImaging.PlayerStand.Position);
        }

        ItemIdx = 0;
        SetItem();

        // Connect RenderStepped to update camera position
        Connections.Set("render", RunService.RenderStepped.Connect(() => OnUpdate()));

        // Connect input events
        Connections.Set("inputBegan", UserInputService.InputBegan.Connect((input, gameProcessed) => {
            if (gameProcessed) return; // Ignore if the game has already processed the input

            if (input.UserInputType === Enum.UserInputType.Keyboard) {
                HandleInput(input.KeyCode);
            }
        }));
    }

    export const Deactivate = () => {
        Connections.ForEach((Con) => Con.Disconnect());
        Connections.Clear(); // Clear all connections

        CurrentItem?.Destroy();

        if (PlayerLastPos !== undefined) {
            const character = Players.LocalPlayer.Character;
            if (character && character.PrimaryPart) {
                character.MoveTo(PlayerLastPos);
            }
        } else {
            Plot.TeleportPlayerOverPlot();
        }

        // Reset camera to default
        Camera.CameraType = Enum.CameraType.Custom;
    }

    const OnUpdate = () => {
        Camera.CFrame = CamFollow.CFrame;
    }

    const SetItem = () => {
        if (CurrentItem !== undefined) {
            CurrentItem.Destroy();
        }

        CurrentItem = Items.At(ItemIdx);
        
        if (CurrentItem === undefined) {
            ItemIdx = 0;
            CurrentItem = Items.At(ItemIdx)!;
        }

        CurrentItem = CurrentItem.Clone();
        CurrentItem.Parent = Base.Parent;

        const OrePossibly = CurrentItem.FindFirstChild("Ore");
        if (OrePossibly !== undefined) {
            OrePossibly.Destroy();
        }

        CurrentItem.CFrame = OGBaseCFrame.add(new Vector3(0, CurrentItem.CollisionHitbox.Size.Y / 2, 0));
        print(CurrentItem.Name);
    }

    const HandleInput = (key: Enum.KeyCode) => {
        switch (key) {
            case Controls.NextItem:
                NextItem();
                break;
            case Controls.PrevItem:
                PrevItem();
                break;
            case Controls.Exit:
                Deactivate();
                break;
            case Controls.RaiseBase:
                RaiseBase();
                break;
            case Controls.LowerBase:
                LowerBase();
                break;
            case Controls.IncreaseRadius:
                IncreaseRadius();
                break;
            case Controls.DecreaseRadius:
                DecreaseRadius();
                break;
            case Controls.RotateRight:
                RotateBase(new Vector3(0, 5, 0)); // Rotate 5 degrees to the right
                break;
            case Controls.RotateLeft:
                RotateBase(new Vector3(0, -5, 0)); // Rotate 5 degrees to the left
                break;
            case Controls.RotateUp:
                RotateBase(new Vector3(0, 0, 5)); // Rotate 5 degrees upwards
                break;
            case Controls.RotateDown:
                RotateBase(new Vector3(0, 0, -5)); // Rotate 5 degrees downwards
                break;
            case Controls.RotateItemXInc:
                RotateItem(new Vector3(2, 0, 0)); // Rotate item 5 degrees on X axis
                break;
            case Controls.RotateItemXDec:
                RotateItem(new Vector3(-2, 0, 0)); // Rotate item -5 degrees on X axis
                break;
            case Controls.RotateItemYInc:
                RotateItem(new Vector3(0, 2, 0)); // Rotate item 5 degrees on Y axis
                break;
            case Controls.RotateItemYDec:
                RotateItem(new Vector3(0, -2, 0)); // Rotate item -5 degrees on Y axis
                break;
            case Controls.RotateItemZInc:
                RotateItem(new Vector3(0, 0, 2)); // Rotate item 5 degrees on Z axis
                break;
            case Controls.RotateItemZDec:
                RotateItem(new Vector3(0, 0, -2)); // Rotate item -5 degrees on Z axis
                break;
            default:
                break;
        }
    }

    const NextItem = () => {
        ItemIdx = (ItemIdx + 1) % Items.Size();
        SetItem();
    }

    const PrevItem = () => {
        ItemIdx = (ItemIdx - 1 + Items.Size()) % Items.Size();
        SetItem();
    }

    const RaiseBase = () => {
        BaseCFrame = BaseCFrame.add(new Vector3(0, 1, 0)); // Move base up by 1 unit
        Base.CFrame = BaseCFrame;
        //UpdateCurrentItemPosition();
    }

    const LowerBase = () => {
        BaseCFrame = BaseCFrame.add(new Vector3(0, -1, 0)); // Move base down by 1 unit
        Base.CFrame = BaseCFrame;
        //UpdateCurrentItemPosition();
    }

    const IncreaseRadius = () => {
        Base.WeldConstraint.Enabled = false;
        const CamRadius = CamFollow.Position.sub(Base.Position).Unit.mul(1);
        CamFollow.Position = CamFollow.Position.add(CamRadius);
        Base.WeldConstraint.Enabled = true;
    }

    const DecreaseRadius = () => {
        Base.WeldConstraint.Enabled = false;
        const CamRadius = CamFollow.Position.sub(Base.Position).Unit.mul(1);
        CamFollow.Position = CamFollow.Position.sub(CamRadius);
        Base.WeldConstraint.Enabled = true;
    }

    const RotateBase = (rotation: Vector3) => {
        BaseCFrame = BaseCFrame.mul(CFrame.Angles(
            math.rad(rotation.X),
            math.rad(rotation.Y),
            math.rad(rotation.Z)
        ));
        Base.CFrame = BaseCFrame;
    }

    const RotateItem = (rotation: Vector3) => {
        if (CurrentItem === undefined) return;

        CurrentItem.CFrame = CurrentItem.CFrame.mul(CFrame.Angles(
            math.rad(rotation.X),
            math.rad(rotation.Y),
            math.rad(rotation.Z)
        ));
    }
}
*/