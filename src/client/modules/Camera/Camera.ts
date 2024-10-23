import { Players, RunService, Workspace } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { Input } from "../Input/Input";
import { Util } from "shared/modules/Util/Util";

export class Camera {
    private static _instance: Camera | undefined;
    private static InsideGuide: Part | undefined;

    private readonly Humanoid = (Players.LocalPlayer.Character || Players.LocalPlayer.CharacterAdded.Wait()[0]).WaitForChild("Humanoid") as Humanoid;
    public readonly CurrentCamera = Workspace.CurrentCamera!;

    private readonly Connections = new Collection<string, RBXScriptConnection>();

    private readonly OriginalCamType =  Workspace.CurrentCamera!.CameraType;
    private readonly OriginalJumpPower: number;
    private readonly OriginalWalkSpeed: number;

    private CameraContainer: Part | undefined;
    private KeyRotationSpeed = 1;
    private KeyRotationSpeedBounds = [0.1, 2];
    private KeyScrollSpeed = 50;
    private KeyScrollSpeedBounds = [25, 75];
    private MovementSpeed = 50;
    private MovementSpeedBounds = [15, 100];
    private RotationSmoothness = 5;
    private RotationSmoothnessBounds = [1, 10];
    private RotationSpeed = 0.004;
    private RotationSpeedBounds = [0.001, 0.007];
    private ScrollSmoothness = 10;
    private ScrollSmoothnessBounds = [5, 15];
    private ScrollSpeed = 5;
    private ScrollSpeedBounds = [1, 10];

    private CurrentPitch = 0;
    private CurrentYaw = 0;
    private LastMousePosition: Vector2 | undefined;
    private PendingPitchChange = 0;
    private PendingRollChange = 0;
    private PendingScrollMovement = new Vector3();
    private PendingYawChange = 0;

    private CurrentMB: Enum.UserInputType.MouseButton1 | Enum.UserInputType.MouseButton2 = Enum.UserInputType.MouseButton1;
    private DisregardContainer = false;
    private InvertCamLR = false;
    private InvertCamUD = false;

    private LookLocks = new Map<ViewDirection, boolean>();
    private LookVectors = new Map<Look, boolean>();
    private MovementLocks = new Map<MoveDirection, boolean>();
    private ScrollLocks = new Map<ZoomDirection, boolean>();

    public static Instance() {
        return Camera._instance || (Camera._instance = new Camera());
    }

    private constructor() {
        this.OriginalJumpPower = this.Humanoid.JumpPower;
        this.OriginalWalkSpeed = this.Humanoid.WalkSpeed;

        this.Init();
    }

    private Init(): void {
        this.InitCamGuide();

        this.CurrentCamera.CameraType = Enum.CameraType.Scriptable;
        this.Humanoid.JumpPower = 0;
        this.Humanoid.WalkSpeed = 0;

        this.LookVectors.set(Look.X, true);
        this.LookVectors.set(Look.Y, true);
        this.LookVectors.set(Look.Z, true);

        this.Connections.Set(
            "on_cam_move",
            (this.CurrentCamera.Changed as RBXScriptSignal).Connect((a) => this.OnCamMove(a))
        );
        this.Connections.Set(
            "on_mouse_down",
            Input.Controls.KeyboardMouse.CamLookStart
                .OnDown("cam_mouse_down", (i) => this.OnMouseDown(i))
                .IgnoreGameProcessedEvent(true)
        );
        this.Connections.Set(
            "on_mouse_move",
            Input.Controls.KeyboardMouse.CamLookDetect
                .OnChanged("cam_mouse_move", (i) => this.OnMouseMove(i))
                .IgnoreGameProcessedEvent(true)
        );
        this.Connections.Set(
            "on_mouse_up",
            Input.Controls.KeyboardMouse.CamLookStart
                .OnUp("cam_mouse_up", (i) => this.OnMouseUp(i))
                .IgnoreGameProcessedEvent(true)
        );
        this.Connections.Set(
            "on_scroll",
            Input.Controls.KeyboardMouse.CamZoomScroll
                .OnChanged("cam_on_scroll", (i) => this.OnScroll(i))
                .IgnoreGameProcessedEvent(true)
        );
        this.Connections.Set(
            "render_stepped",
            RunService.PreRender.Connect((dt) => this.Update(dt))
        );

        _G.Log("Camera initialized.", "Camera");
    }

    private InitCamGuide(): void {
        if (Camera.InsideGuide !== undefined) return;

        const Guide = new Instance("Part");
        Guide.Size = new Vector3(0.1, 0.1, 0.1);
        //Guide.Position = Position;
        Guide.Anchored = true;
        Guide.CanCollide = false;
        Guide.Parent = Workspace;
        Guide.Transparency = 1;
        Guide.Name = "CameraBoundGuide";

        Camera.InsideGuide = Guide;

        _G.Log("Camera guide initialized.", "Camera");
    }

    private ConstrainToContainer(Position: Vector3): Vector3 {
        if (!this.CameraContainer) return Position;

        const Part = this.CameraContainer;
        const containmentSize = Part.Size.div(2);
        const containmentPosition = Part.Position;

        const MinBounds = containmentPosition.sub(containmentSize);
        const MaxBounds = containmentPosition.add(containmentSize);

        return new Vector3(
            math.clamp(Position.X, MinBounds.X, MaxBounds.X),
            math.clamp(Position.Y, MinBounds.Y, MaxBounds.Y),
            math.clamp(Position.Z, MinBounds.Z, MaxBounds.Z)
        );
    }

    public FlipMouseButtons(Button?: Enum.UserInputType.MouseButton1 | Enum.UserInputType.MouseButton2): this {
        const FlipTo = Button || (this.CurrentMB === Enum.UserInputType.MouseButton1 ? Enum.UserInputType.MouseButton2 : Enum.UserInputType.MouseButton1);
        this.CurrentMB = FlipTo;

        this.Connections.Get("on_mouse_down")?.Disconnect();
        this.Connections.Get("on_mouse_up")?.Disconnect();

        this.Connections.Set(
            "on_mouse_down",
            FlipTo === Enum.UserInputType.MouseButton1
                ? Input.Controls.KeyboardMouse.CamLookStart
                    .OnDown("cam_mouse_down", (i) => this.OnMouseDown(i))
                    .IgnoreGameProcessedEvent(true)
                : Input.Controls.KeyboardMouse.CamLookStartFlip
                    .OnDown("cam_mouse_down", (i) => this.OnMouseDown(i))
                    .IgnoreGameProcessedEvent(true)
        );

        this.Connections.Set(
            "on_mouse_up",
            FlipTo === Enum.UserInputType.MouseButton1
                ? Input.Controls.KeyboardMouse.CamLookStart
                    .OnUp("cam_mouse_up", (i) => this.OnMouseUp(i))
                    .IgnoreGameProcessedEvent(true)
                : Input.Controls.KeyboardMouse.CamLookStartFlip
                    .OnUp("cam_mouse_up", (i) => this.OnMouseUp(i))
                    .IgnoreGameProcessedEvent(true)
        );

        _G.Log(`Mouse buttons flipped to ${FlipTo === Enum.UserInputType.MouseButton1 ? "MouseButton1" : "MouseButton2"}.`, "Camera");

        return this;
    }

    public GetCamera(): globalThis.Camera {
        return this.CurrentCamera;
    }

    public GetCameraContainer(): Part | undefined {
        return this.CameraContainer;
    }

    public GetCameraSpeed(): number {
        return Util.UnLerp(this.MovementSpeedBounds[0], this.MovementSpeedBounds[1], this.MovementSpeed);
    }

    public GetKeyRotationSpeed(): number {
        return Util.UnLerp(this.KeyRotationSpeedBounds[0], this.KeyRotationSpeedBounds[1], this.KeyRotationSpeed);
    }

    public GetKeyScrollSpeed(): number {
        return Util.UnLerp(this.KeyScrollSpeedBounds[0], this.KeyScrollSpeedBounds[1], this.KeyScrollSpeed);
    }

    public GetRotationSmoothness(): number {
        return Util.UnLerp(this.RotationSmoothnessBounds[0], this.RotationSmoothnessBounds[1], this.RotationSmoothness);
    }

    public GetRotationSpeed(): number {
        return Util.UnLerp(this.RotationSpeedBounds[0], this.RotationSpeedBounds[1], this.RotationSpeed);
    }

    public GetScrollSmoothness(): number {
        return Util.UnLerp(this.ScrollSmoothnessBounds[0], this.ScrollSmoothnessBounds[1], this.ScrollSmoothness);
    }

    public GetScrollSpeed(): number {
        return Util.UnLerp(this.ScrollSpeedBounds[0], this.ScrollSpeedBounds[1], this.ScrollSpeed);
    }

    public InvertCamLeftRight(yes?: boolean): this {
        if (yes !== undefined) {
            this.InvertCamLR = yes;
            return this;
        }

        this.InvertCamLR = !this.InvertCamLR;
        _G.Log(`Camera left-right inversion set to ${this.InvertCamLR ? "true" : "false"}.`, "Camera");
        return this;
    }

    public InvertCamUpDown(yes?: boolean): this {
        if (yes !== undefined) {
            this.InvertCamUD = yes;
            return this;
        }

        this.InvertCamUD = !this.InvertCamUD;
        _G.Log(`Camera up-down inversion set to ${this.InvertCamUD ? "true" : "false"}.`, "Camera");
        return this;
    }

    public static IsInstanced(): boolean {
        return Camera._instance !== undefined;
    }

    public LockLookDirections(...dirs: ViewDirection[]): this {
        dirs.forEach(d => this.LookLocks.set(d, true));
        _G.Log(`Camera look directions locked: ${dirs.map(d => ViewDirection[d]).join(", ")}.`, "Camera");
        return this;
    }

    public LockMoveDirections(...dirs: MoveDirection[]): this {
        dirs.forEach(d => this.MovementLocks.set(d, true));
        _G.Log(`Camera move directions locked: ${dirs.map(d => MoveDirection[d]).join(", ")}.`, "Camera");
        return this;
    }

    public LockZoomDirections(...dirs: ZoomDirection[]): this {
        dirs.forEach(d => this.ScrollLocks.set(d, true));
        _G.Log(`Camera zoom directions locked: ${dirs.map(d => ZoomDirection[d]).join(", ")}.`, "Camera");
        return this;
    }

    private OnCamMove(attr: string): void {
        if (attr !== "CFrame") return;

        Camera.InsideGuide!.CFrame = this.CurrentCamera.CFrame;
    }

    private OnMouseDown(input: InputObject): void {
        if (this.CurrentCamera.CameraType !== Enum.CameraType.Scriptable) return;

        this.LastMousePosition = new Vector2(input.Position.X, input.Position.Y);
    }

    private OnMouseMove(input: InputObject): void {
        if (this.CurrentCamera.CameraType !== Enum.CameraType.Scriptable) return;
        if (this.LastMousePosition === undefined) return;

        const CurrentMousePosition = new Vector2(input.Position.X, input.Position.Y);
        const Delta = CurrentMousePosition.sub(this.LastMousePosition);
        this.LastMousePosition = CurrentMousePosition;

        // Adjust this value to control the sensitivity of the rotation
        const RotationSensitivity = this.RotationSpeed;

        const InvertYaw = this.InvertCamLR ? 1 : -1;
        const InvertPitch = this.InvertCamUD ? 1 : -1;

        // Calculate the change in yaw (rotation around the Y-axis)
        const DeltaYaw = Delta.X * RotationSensitivity * InvertYaw;
        const DeltaPitch = Delta.Y * RotationSensitivity * InvertPitch;
        //const DeltaRoll = Delta.X * RotationSensitivity * 1; // This may not be right.

        // Account for ViewDirection locks
        const LockedYaw = 
            (Delta.X > 0 && this.LookLocks.get(ViewDirection.Left))
            ? 0
            : (Delta.X < 0 && this.LookLocks.get(ViewDirection.Right))
            ? 0
            : 1;
        
        const LockedPitch =
            (Delta.Y > 0 && this.LookLocks.get(ViewDirection.Down))
            ? 0
            : (Delta.Y < 0 && this.LookLocks.get(ViewDirection.Up))
            ? 0
            : 1;

        // Store the desired change in yaw
        this.PendingYawChange += DeltaYaw * LockedYaw;
        this.PendingPitchChange += DeltaPitch * LockedPitch;
        //this.PendingRollChange += DeltaRoll;
    }

    private OnMouseUp(input: InputObject): void {
        if (this.CurrentCamera.CameraType !== Enum.CameraType.Scriptable) return;

        this.LastMousePosition = undefined;
    }

    private OnScroll(input: InputObject): void {
        if (this.CurrentCamera.CameraType !== Enum.CameraType.Scriptable) return;

        const ScrollAmount = input.Position.Z;
        const ScrollDelta = this.CurrentCamera.CFrame.LookVector.mul(this.ScrollSpeed * ScrollAmount);

        // Account for scroll locks
        if (ScrollAmount > 0 && this.ScrollLocks.get(ZoomDirection.In)) return;
        if (ScrollAmount < 0 && this.ScrollLocks.get(ZoomDirection.Out)) return;
    
        // Store the scroll movement to be applied over time
        this.PendingScrollMovement = this.PendingScrollMovement.add(ScrollDelta);
    }

    /** Return to default camera */
    public Reset(): void {
        this.CurrentCamera.CameraType = this.OriginalCamType;
        this.Humanoid.JumpPower = this.OriginalJumpPower;
        this.Humanoid.WalkSpeed = this.OriginalWalkSpeed;

        this.Connections.ForEach(c => c.Disconnect());
        this.Connections.Clear();

        Camera._instance = undefined;
        _G.Log("Camera reset.", "Camera");
    }

    public SetCameraContainer(part: Part): this {
        this.CameraContainer = part;
        Camera.InsideGuide!.Parent = part;
        _G.Log("Camera container set.", "Camera");
        return this;
    }

    /**
     * Set camera displacement speed.
     * @param speed The speed to set the camera movement to 0 - 1
     * @default 0.411
     */
    public SetCameraSpeed(speed: number): this {
        this.MovementSpeed = Util.Lerp(this.MovementSpeedBounds[0], this.MovementSpeedBounds[1], speed);
        _G.Log(`Camera speed set to ${speed}.`, "Camera");
        return this;
    }

    public SetContainerDisregard(yes?: boolean): this {
        this.DisregardContainer = yes === undefined ? !this.DisregardContainer : yes;
        _G.Log(`Camera container disregard set to ${this.DisregardContainer ? "true" : "false"}.`, "Camera");
        return this;
    }

    /**
     * Set camera rotation speed via keys or buttons.
     * @param speed The speed to set the camera rotation to 0 - 1
     * @default 0.5 
     */
    public SetKeyRotationSpeed(speed: number): this {
        this.KeyRotationSpeed = Util.Lerp(this.KeyRotationSpeedBounds[0], this.KeyRotationSpeedBounds[1], speed);
        _G.Log(`Camera rotation speed set to ${speed}.`, "Camera");
        return this;
    }

    /**
     * Set camera scroll speed via keys or buttons.
     * @param speed The speed to set the camera scroll to 0 - 1
     * @default 0.5
     */
    public SetKeyScrollSpeed(speed: number): this {
        this.KeyScrollSpeed = Util.Lerp(this.KeyScrollSpeedBounds[0], this.KeyScrollSpeedBounds[1], speed);
        _G.Log(`Camera scroll speed set to ${speed}.`, "Camera");
        return this;
    }

    public SetLookVectors(...v: Look[]): this {
        v.forEach(v => this.LookVectors.set(v, true));
        _G.Log(`Camera look vectors set: ${v.map(v => Look[v]).join(", ")}.`, "Camera");
        return this;
    }

    /**
     * Set the pitch and yaw of the camera.
     * @param pitch_rad The pitch in radians
     * @param yaw_rad The yaw in radians
     */
    public SetOrientation(pitch_rad: number, yaw_rad: number): this {
        this.CurrentPitch = math.clamp(pitch_rad, math.rad(-89), math.rad(89));
        this.CurrentYaw = yaw_rad;
        _G.Log(`Camera orientation set to pitch: ${pitch_rad}, yaw: ${yaw_rad}.`, "Camera");
        return this;
    }

    /**
     * Set the smoothness of the rotation. Lower values are more smooth (fling).
     * @param smoothness The smoothness of the rotation 0 - 1
     * @default 0.5
     */
    public SetRotationSmoothness(smoothness: number): this {
        this.RotationSmoothness = Util.Lerp(this.RotationSmoothnessBounds[0], this.RotationSmoothnessBounds[1], smoothness);
        _G.Log(`Camera rotation smoothness set to ${smoothness}.`, "Camera");
        return this;
    }

    /**
     * Set camera rotation speed via mouse.
     * @param speed The speed to set the camera rotation to 0 - 1
     * @default 0.5 
     */
    public SetRotationSpeed(speed: number): this {
        this.RotationSpeed = Util.Lerp(this.RotationSpeedBounds[0], this.RotationSpeedBounds[1], speed);
        _G.Log(`Camera rotation speed set to ${speed}.`, "Camera");
        return this;
    }

    /**
     * Set the smoothness of the scroll. Lower values are more smooth (fling).
     * @param smoothness The smoothness of the scroll 0 - 1
     * @default 0.5 
     */
    public SetScrollSmoothness(smoothness: number): this {
        this.ScrollSmoothness = Util.Lerp(this.ScrollSmoothnessBounds[0], this.ScrollSmoothnessBounds[1], smoothness);
        _G.Log(`Camera scroll smoothness set to ${smoothness}.`, "Camera");
        return this;
    }

    /**
     * Set camera scroll speed via mouse.
     * @param speed The speed to set the camera scroll to 0 - 1
     * @default 0.45
     */
    public SetScrollSpeed(speed: number): this {
        this.ScrollSpeed = Util.Lerp(this.ScrollSpeedBounds[0], this.ScrollSpeedBounds[1], speed);
        _G.Log(`Camera scroll speed set to ${speed}.`, "Camera");
        return this;
    }

    public UnLockLookDirections(...dirs: ViewDirection[]): this {
        dirs.forEach(d => this.LookLocks.set(d, false));
        _G.Log(`Camera look directions unlocked: ${dirs.map(d => ViewDirection[d]).join(", ")}.`, "Camera");
        return this;
    }

    public UnLockMoveDirections(...dirs: MoveDirection[]): this {
        dirs.forEach(d => this.MovementLocks.set(d, false));
        _G.Log(`Camera move directions unlocked: ${dirs.map(d => MoveDirection[d]).join(", ")}.`, "Camera");
        return this;
    }

    public UnLockZoomDirections(...dirs: ZoomDirection[]): this {
        dirs.forEach(d => this.ScrollLocks.set(d, false));
        _G.Log(`Camera zoom directions unlocked: ${dirs.map(d => ZoomDirection[d]).join(", ")}.`, "Camera");
        return this;
    }

    public UnSetLookVectors(...v: Look[]): this {
        v.forEach(v => this.LookVectors.set(v, false));
        _G.Log(`Camera look vectors unset: ${v.map(v => Look[v]).join(", ")}.`, "Camera");
        return this;
    }

    private Update(deltaTime: number) {
        if (this.CurrentCamera.CameraType !== Enum.CameraType.Scriptable) return;
        const CurrentCamera = this.CurrentCamera;
    
        const CameraForward = new Vector3(
            !this.LookVectors.get(Look.X) ? 0 : CurrentCamera.CFrame.LookVector.X, 
            !this.LookVectors.get(Look.Y) ? 0 : CurrentCamera.CFrame.LookVector.Y,
            !this.LookVectors.get(Look.Z) ? 0 : CurrentCamera.CFrame.LookVector.Z
        ).Unit;

        const CameraRight = CameraForward.Cross(new Vector3(0, 1, 0)).Unit;
    
        let moveDirection = new Vector3();
        if (Input.Controls.KeyboardMouse.CamForward.IsDown() && !this.MovementLocks.get(MoveDirection.Forward)) {
            moveDirection = moveDirection.add(CameraForward);
        }
        if (Input.Controls.KeyboardMouse.CamLeft.IsDown() && !this.MovementLocks.get(MoveDirection.Left)) {
            moveDirection = moveDirection.add(CameraRight.mul(-1));
        }
        if (Input.Controls.KeyboardMouse.CamBack.IsDown() && !this.MovementLocks.get(MoveDirection.Backward)) {
            moveDirection = moveDirection.add(CameraForward.mul(-1));
        }
        if (Input.Controls.KeyboardMouse.CamRight.IsDown() && !this.MovementLocks.get(MoveDirection.Right)) {
            moveDirection = moveDirection.add(CameraRight);
        }
    
        const MoveDelta = moveDirection.mul(this.MovementSpeed * deltaTime);
        const NewCameraPosition = (this.DisregardContainer) 
            ? CurrentCamera.CFrame.Position.add(MoveDelta)
            : this.ConstrainToContainer(CurrentCamera.CFrame.Position.add(MoveDelta));
        
        CurrentCamera.CFrame = new CFrame(NewCameraPosition, CurrentCamera.CFrame.LookVector.add(NewCameraPosition));
    
        const ScrollMovement = this.PendingScrollMovement.mul(deltaTime * this.ScrollSmoothness);
        this.PendingScrollMovement = this.PendingScrollMovement.sub(ScrollMovement);
    
        const NewScrollPosition = (this.DisregardContainer)
            ? CurrentCamera.CFrame.Position.add(ScrollMovement)
            : this.ConstrainToContainer(CurrentCamera.CFrame.Position.add(ScrollMovement));
            
        CurrentCamera.CFrame = new CFrame(NewScrollPosition, CurrentCamera.CFrame.LookVector.add(NewScrollPosition));
    
        // Handle mouse movement for yaw and pitch
        const mouseYawChange = this.PendingYawChange * deltaTime * this.RotationSmoothness;
        this.CurrentYaw += mouseYawChange;
        this.PendingYawChange -= mouseYawChange;
    
        const mousePitchChange = this.PendingPitchChange * deltaTime * this.RotationSmoothness;
        this.CurrentPitch = math.clamp(this.CurrentPitch + mousePitchChange, math.rad(-89), math.rad(89));
        this.PendingPitchChange -= mousePitchChange;
    
        // Handle arrow keys for additional yaw and pitch control
        const arrowKeyYawChange = deltaTime * this.KeyRotationSpeed;
        const arrowKeyPitchChange = deltaTime * this.KeyRotationSpeed;

        const InvertYaw = this.InvertCamLR ? -1 : 1;
        const InvertPitch = this.InvertCamUD ? -1 : 1;
    
        if (Input.Controls.KeyboardMouse.CamViewLeft.IsDown() && !this.LookLocks.get(ViewDirection.Left)) {
            this.CurrentYaw += arrowKeyYawChange * InvertYaw;
        }
        if (Input.Controls.KeyboardMouse.CamViewRight.IsDown() && !this.LookLocks.get(ViewDirection.Right)) {
            this.CurrentYaw -= arrowKeyYawChange * InvertYaw;
        }
        if (Input.Controls.KeyboardMouse.CamViewUp.IsDown() && !this.LookLocks.get(ViewDirection.Up)) {
            this.CurrentPitch = math.clamp(this.CurrentPitch + arrowKeyPitchChange * InvertPitch, math.rad(-89), math.rad(89));
        }
        if (Input.Controls.KeyboardMouse.CamViewDown.IsDown() && !this.LookLocks.get(ViewDirection.Down)) {
            this.CurrentPitch = math.clamp(this.CurrentPitch - arrowKeyPitchChange * InvertPitch, math.rad(-89), math.rad(89));
        }

         // Handle zoom in and zoom out using keys
        const zoomSpeed = this.KeyScrollSpeed * deltaTime;
        if (Input.Controls.KeyboardMouse.CamZoomIn.IsDown() && !this.ScrollLocks.get(ZoomDirection.In)) { // Zoom in key
            this.PendingScrollMovement = this.PendingScrollMovement.add(CurrentCamera.CFrame.LookVector.mul(zoomSpeed));
        }
        if (Input.Controls.KeyboardMouse.CamZoomOut.IsDown() && !this.ScrollLocks.get(ZoomDirection.Out)) { // Zoom out key
            this.PendingScrollMovement = this.PendingScrollMovement.add(CurrentCamera.CFrame.LookVector.mul(-zoomSpeed));
        }
    
        // Create the new CFrame with separate yaw and pitch
        const CameraPosition = CurrentCamera.CFrame.Position;
        const YawRotation = CFrame.Angles(0, this.CurrentYaw, 0);
        const PitchRotation = CFrame.Angles(this.CurrentPitch, 0, 0);
    
        // Apply the pitch first, then the yaw
        CurrentCamera.CFrame = new CFrame(CameraPosition)
            .mul(YawRotation)
            .mul(PitchRotation);
    }
    
}

export enum Look {
    X,
    Y,
    Z
}

export enum MoveDirection {
    Forward,
    Backward,
    Left,
    Right
}

export enum ViewDirection {
    Up,
    Down,
    Left,
    Right
}

export enum ZoomDirection {
    In,
    Out
}