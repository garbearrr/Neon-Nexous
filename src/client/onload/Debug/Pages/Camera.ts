import { Players } from "@rbxts/services";
import { DragBarWidget } from "client/modules/UI/DragBarWidget";
import { MultiButtonWidget } from "client/modules/UI/MultiButtonWidget";
import { WidgetPage } from "client/modules/UI/WidgetPage";
import { DebugWidgetManager } from "../debug";
import { Camera, Look, MoveDirection, ViewDirection, ZoomDirection } from "client/modules/Camera/Camera";
import { Plot } from "client/modules/Plot/Plot";
import { MultiToggleWidget } from "client/modules/UI/MultiToggleWidget";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const DebugFrame = MainUI.MainFrame.Content.ScrollingFrame.Debug.Content.SettingsFrame.ScrollingFrame;

const Page = new WidgetPage("Camera", DebugFrame);

const ActivateCamera = new MultiButtonWidget("Activate Camera")
    .AddButton("Activate", (Button) => {
        Camera.Instance();
        Page.UpdateAll();
    })
    .AddButton("Deactivate", (Button) => {
        Camera.Instance().Reset();
    });

const TPToPlot = new MultiButtonWidget("TP To Plot")
    .AddButton("TP", (Button) => {
        Camera.Instance().GetCamera().CFrame = Plot.CameraContainer.CFrame;
        Page.UpdateAll();
    });

const ChangeTime = new DragBarWidget("Camera Speed")
    .SetBounds(0, 1)
    .SetButtonIncrementDecrement(0.1)
    .SetUpdateCallback(() => {
        return Camera.Instance().GetCameraSpeed();
    })
    .SetActionCallback((Value) => {
        Camera.Instance().SetCameraSpeed(Value);
    })
    .MakeUpdateVisible();
    

const KeyRotationSpeed = new DragBarWidget("Key Rotation Speed")
    .SetBounds(0, 1)
    .SetButtonIncrementDecrement(0.1)
    .SetUpdateCallback(() => {
        return Camera.Instance().GetKeyRotationSpeed();
    })
    .SetActionCallback((Value) => {
        Camera.Instance().SetKeyRotationSpeed(Value);
    })
    .MakeUpdateVisible();
    

const KeyScrollSpeed = new DragBarWidget("Key Scroll Speed")
    .SetBounds(0, 1)
    .SetButtonIncrementDecrement(0.1)
    .SetUpdateCallback(() => {
        return Camera.Instance().GetKeyScrollSpeed();
    })
    .SetActionCallback((Value) => {
        Camera.Instance().SetKeyScrollSpeed(Value);
    })
    .MakeUpdateVisible();
    

const RotationSmoothness = new DragBarWidget("Rotation Smoothness")
    .SetBounds(0, 1)
    .SetButtonIncrementDecrement(0.1)
    .SetUpdateCallback(() => {
        return Camera.Instance().GetRotationSmoothness();
    })
    .SetActionCallback((Value) => {
        Camera.Instance().SetRotationSmoothness(Value);
    })
    .MakeUpdateVisible();
    

const RotationSpeed = new DragBarWidget("Rotation Speed")
    .SetBounds(0, 1)
    .SetButtonIncrementDecrement(0.1)
    .SetUpdateCallback(() => {
        return Camera.Instance().GetRotationSpeed();
    })
    .SetActionCallback((Value) => {
        Camera.Instance().SetRotationSpeed(Value);
    })
    .MakeUpdateVisible();
    

const ScrollSmoothness = new DragBarWidget("Scroll Smoothness")
    .SetBounds(0, 1)
    .SetButtonIncrementDecrement(0.1)
    .SetUpdateCallback(() => {
        return Camera.Instance().GetScrollSmoothness();
    })
    .SetActionCallback((Value) => {
        Camera.Instance().SetScrollSmoothness(Value);
    })
    .MakeUpdateVisible();
    

const ScrollSpeed = new DragBarWidget("Scroll Speed")
    .SetBounds(0, 1)
    .SetButtonIncrementDecrement(0.1)
    .SetUpdateCallback(() => {
        return Camera.Instance().GetScrollSpeed();
    })
    .SetActionCallback((Value) => {
        Camera.Instance().SetScrollSpeed(Value);
    })
    .MakeUpdateVisible();
    
const Controls = new MultiToggleWidget("Controls")
    .AddButton("Invert Cam LR", (NewValue) => {
        Camera.Instance().InvertCamLeftRight();
    })
    .AddButton("Invert Cam UD", (NewValue) => {
        Camera.Instance().InvertCamUpDown();
    })
    .AddButton("Flip Mouse Buttons", (NewValue) => {
        Camera.Instance().FlipMouseButtons();
    })
    .SetUpdateCallback(() => {
        return [
            ["Invert Cam LR", Camera.Instance().IsInvertedCamLeftRight()],
            ["Invert Cam UD", Camera.Instance().IsInvertedCamUpDown()],
            ["Flip Mouse Buttons", Camera.Instance().AreMBFlipped()]
        ];
    })
    .MakeUpdateVisible()

const Container = new MultiToggleWidget("Container")
    .AddButton("Disregard Container", (NewValue) => {
        Camera.Instance().SetContainerDisregard();
    })
    .AddButton("Show Container", (NewValue) => {
        const Con = Camera.Instance().GetCameraContainer();
        if (Con === undefined) return;
        Con.Transparency = NewValue ? 0 : 1;
    })
    .SetUpdateCallback(() => {
        return [
            ["Disregard Container", Camera.Instance().IsContainerDisregarded()],
            ["Show Container", Camera.Instance().GetCameraContainer()?.Transparency === 0]
        ];
    })
    .MakeUpdateVisible();

const LockCamMove = new MultiToggleWidget("Lock Cam Move")
    .AddButton("Left", (NewValue) => {
        NewValue
        ? Camera.Instance().LockMoveDirections(MoveDirection.Left)
        : Camera.Instance().UnLockMoveDirections(MoveDirection.Left);
    })
    .AddButton("Right", (NewValue) => {
        NewValue
        ? Camera.Instance().LockMoveDirections(MoveDirection.Right)
        : Camera.Instance().UnLockMoveDirections(MoveDirection.Right);
    })
    .AddButton("Forward", (NewValue) => {
        NewValue
        ? Camera.Instance().LockMoveDirections(MoveDirection.Forward)
        : Camera.Instance().UnLockMoveDirections(MoveDirection.Forward);
    })
    .AddButton("Backward", (NewValue) => {
        NewValue
        ? Camera.Instance().LockMoveDirections(MoveDirection.Backward)
        : Camera.Instance().UnLockMoveDirections(MoveDirection.Backward);
    })
    .SetUpdateCallback(() => {
        return [
            ["Left", Camera.Instance().IsMoveDirectionLocked(MoveDirection.Left)],
            ["Right", Camera.Instance().IsMoveDirectionLocked(MoveDirection.Right)],
            ["Forward", Camera.Instance().IsMoveDirectionLocked(MoveDirection.Forward)],
            ["Backward", Camera.Instance().IsMoveDirectionLocked(MoveDirection.Backward)]
        ];
    })
    .MakeUpdateVisible();

const LockCamLook = new MultiToggleWidget("Lock Cam Look")
    .AddButton("Left", (NewValue) => {
        NewValue
        ? Camera.Instance().LockLookDirections(ViewDirection.Left)
        : Camera.Instance().UnLockLookDirections(ViewDirection.Left);
    })
    .AddButton("Right", (NewValue) => {
        NewValue
        ? Camera.Instance().LockLookDirections(ViewDirection.Right)
        : Camera.Instance().UnLockLookDirections(ViewDirection.Right);
    })
    .AddButton("Up", (NewValue) => {
        NewValue
        ? Camera.Instance().LockLookDirections(ViewDirection.Up)
        : Camera.Instance().UnLockLookDirections(ViewDirection.Up);
    })
    .AddButton("Down", (NewValue) => {
        NewValue
        ? Camera.Instance().LockLookDirections(ViewDirection.Down)
        : Camera.Instance().UnLockLookDirections(ViewDirection.Down);
    })
    .SetUpdateCallback(() => {
        return [
            ["Left", Camera.Instance().IsViewDirectionLocked(ViewDirection.Left)],
            ["Right", Camera.Instance().IsViewDirectionLocked(ViewDirection.Right)],
            ["Up", Camera.Instance().IsViewDirectionLocked(ViewDirection.Up)],
            ["Down", Camera.Instance().IsViewDirectionLocked(ViewDirection.Down)]
        ];
    })
    .MakeUpdateVisible();

const LockZoomDirection = new MultiToggleWidget("Lock Zoom Direction")
    .AddButton("In", (NewValue) => {
        NewValue
        ? Camera.Instance().LockZoomDirections(ZoomDirection.In)
        : Camera.Instance().LockZoomDirections(ZoomDirection.In);
    })
    .AddButton("Out", (NewValue) => {
        NewValue
        ? Camera.Instance().LockZoomDirections(ZoomDirection.Out)
        : Camera.Instance().LockZoomDirections(ZoomDirection.Out);
    })
    .SetUpdateCallback(() => {
        return [
            ["In", Camera.Instance().IsZoomDirectionLocked(ZoomDirection.In)],
            ["Out", Camera.Instance().IsZoomDirectionLocked(ZoomDirection.Out)]
        ];
    })
    .MakeUpdateVisible();

const CamLookVectors = new MultiToggleWidget("Cam Look Vectors")
    .AddButton("X", (NewValue) => {
        NewValue
        ? Camera.Instance().SetLookVectors(Look.X)
        : Camera.Instance().UnSetLookVectors(Look.X);
    })
    .AddButton("Y", (NewValue) => {
        NewValue
        ? Camera.Instance().SetLookVectors(Look.Y)
        : Camera.Instance().UnSetLookVectors(Look.Y);
    })
    .AddButton("Z", (NewValue) => {
        NewValue
        ? Camera.Instance().SetLookVectors(Look.Z)
        : Camera.Instance().UnSetLookVectors(Look.Z);
    })
    .SetUpdateCallback(() => {
        return [
            ["X", Camera.Instance().IsLookVectorSet(Look.X)],
            ["Y", Camera.Instance().IsLookVectorSet(Look.Y)],
            ["Z", Camera.Instance().IsLookVectorSet(Look.Z)]
        ];
    })

Page
    .AddWidget(ActivateCamera)
    .AddWidget(TPToPlot)
    .AddWidget(ChangeTime)
    .AddWidget(KeyRotationSpeed)
    .AddWidget(KeyScrollSpeed)
    .AddWidget(RotationSmoothness)
    .AddWidget(RotationSpeed)
    .AddWidget(ScrollSmoothness)
    .AddWidget(ScrollSpeed)
    .AddWidget(Controls)
    .AddWidget(Container)
    .AddWidget(LockCamMove)
    .AddWidget(LockCamLook)
    .AddWidget(LockZoomDirection)
    .AddWidget(CamLookVectors)
    .ShowWidgets();


DebugWidgetManager.AddPage(Page);