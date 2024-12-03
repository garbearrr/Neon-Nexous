// Ui3DPage.ts
import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";

/*
const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const Base3D = PlayerGui.WaitForChild("Base3D") as StarterGui["Base3D"];
const Main3DFrame = Base3D.WaitForChild("MainFrame") as Frame;
Main3DFrame.Visible = false;

export class Ui3DPage {
    public readonly BBUI: typeof Base3D;
    public readonly Page: Frame;
    public readonly Part: Part;

    private Camera = Workspace.CurrentCamera as Camera;
    private Connections = new Collection<string, RBXScriptConnection>();

    // Default size and position scales and offsets
    private SizeScale = new Vector2(0.75, 0.70); // Default scale (75% width, 70% height)
    private SizeOffset = new Vector2(0, 0);      // Default offset (0 studs)
    private PositionScale = new Vector2(0.5, 0.5); // Default to center of the screen
    private PositionOffset = new Vector2(0, 0);    // Default offset (0 studs)

    private Distance = 7;
    private Focused = false;
    private Hovered = false;
    private LastScreenSize = this.Camera.ViewportSize;
    private MouseXOffset = 0;
    private MouseYOffset = 0;
    private MaxRotationAngle = math.rad(0.3);
    private ScreenSize = this.Camera.ViewportSize;
    private HoverOffsetY = 0;
    private HoverTargetOffsetY = 0;
    private HoverSpeed = 2; // Units per second
    private OnClickedCallback?: () => void;
    private RaiseHeight = 0.5;

    constructor(Page: Frame, Name: string) {
        // Create a new Part
        const Part = new Instance("Part");
        Part.Name = Name;
        Part.Size = new Vector3(4, 4, 0.1); // Initial size, will be adjusted
        Part.Anchored = true;
        Part.CanCollide = false;
        Part.Transparency = 1; // Make it invisible
        Part.Parent = Workspace;
        this.Part = Part;

        // Create a SurfaceGui or BillboardGui
        const Gui = Base3D.Clone();
        Gui.Parent = PlayerGui;
        Gui.Adornee = Part;
        Gui.Name = Name;

        Gui.MainFrame.Visible = true;

        const PageClone = Page.Clone();
        PageClone.Parent = Gui.MainFrame.ContentFrame;
        PageClone.Visible = true;
        this.Page = PageClone;
        this.BBUI = Gui;
    }

    public Activate() {
        const player = Players.LocalPlayer;
        const mouse = player.GetMouse();

        // Connect mouse movement for rotation (only if focused)
        const UISCon = UserInputService.InputChanged.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseMovement) {
                const MousePosition = UserInputService.GetMouseLocation();
                this.MouseXOffset = (MousePosition.X - this.ScreenSize.X / 2) / (this.ScreenSize.X / 2);
                this.MouseYOffset = (MousePosition.Y - this.ScreenSize.Y / 2) / (this.ScreenSize.Y / 2);
            }
        });

        this.Connections.Set("UISCon", UISCon);

        this.LastScreenSize = this.ScreenSize;

        const RenderCon = RunService.RenderStepped.Connect((deltaTime) => {
            const CameraCFrame = this.Camera.CFrame;

            // Check if the screen size has changed
            this.ScreenSize = this.Camera.ViewportSize;
            if (this.ScreenSize !== this.LastScreenSize) {
                this.LastScreenSize = this.ScreenSize;
            }

            // Calculate the part's size based on the desired scales and offsets
            const Fov = math.rad(this.Camera.FieldOfView); // Convert FOV to radians
            const AspectRatio = this.ScreenSize.X / this.ScreenSize.Y;

            // Frustum height and width at the fixed distance
            const FrustumHeight = 2 * this.Distance * math.tan(Fov / 2);
            const FrustumWidth = FrustumHeight * AspectRatio;

            // Calculate size based on scale
            const PartWidthScale = FrustumWidth * this.SizeScale.X;
            const PartHeightScale = FrustumHeight * this.SizeScale.Y;

            // Add offset to size
            const PartWidth = PartWidthScale + this.SizeOffset.X;
            const PartHeight = PartHeightScale + this.SizeOffset.Y;

            // Update the part's size
            this.Part.Size = new Vector3(PartWidth, PartHeight, this.Part.Size.Z);

            // Update HoverOffsetY towards HoverTargetOffsetY
            const deltaOffsetY = this.HoverTargetOffsetY - this.HoverOffsetY;
            const maxDelta = this.HoverSpeed * deltaTime;
            if (math.abs(deltaOffsetY) > 0.001) {
                this.HoverOffsetY += math.clamp(deltaOffsetY, -maxDelta, maxDelta);
            } else {
                this.HoverOffsetY = this.HoverTargetOffsetY;
            }

            // Calculate position offsets in studs
            const screenPositionX = (this.PositionScale.X - 0.5) * 2; // ranges from -1 to 1
            const screenPositionY = (this.PositionScale.Y - 0.5) * 2; // ranges from -1 to 1

            const positionOffsetX = screenPositionX * FrustumWidth / 2 + this.PositionOffset.X;
            const positionOffsetY = -screenPositionY * FrustumHeight / 2 + this.PositionOffset.Y; // Negative because Y axis inversion

            // Position the part in front of the camera at the fixed distance
            const totalOffset = new Vector3(positionOffsetX, positionOffsetY + this.HoverOffsetY, -this.Distance);
            let partCFrame = CameraCFrame.mul(new CFrame(totalOffset));

            // Apply rotation if focused
            if (this.Focused) {
                const xRotation = this.MouseYOffset * this.MaxRotationAngle;
                const yRotation = -this.MouseXOffset * this.MaxRotationAngle;
                const rotationCFrame = CFrame.Angles(xRotation, yRotation, 0);
                this.Part.CFrame = partCFrame.mul(rotationCFrame);
            } else {
                this.Part.CFrame = partCFrame;
            }
        });

        this.Connections.Set("RenderCon", RenderCon);

        // Set up mouse hover detection
        const MouseMoveCon = mouse.Move.Connect(() => {
            if (mouse.Target === this.Part && !this.Focused) {
                if (!this.Hovered) {
                    this.Hovered = true;
                    this.HoverTargetOffsetY = this.RaiseHeight; // Raise by specified height
                }
            } else {
                if (this.Hovered) {
                    this.Hovered = false;
                    this.HoverTargetOffsetY = 0; // Return to base position
                }
            }
        });

        this.Connections.Set("MouseMoveCon", MouseMoveCon);

        // Set up click detection
        const MouseClickCon = mouse.Button1Down.Connect(() => {
            if (mouse.Target === this.Part) {
                if (this.OnClickedCallback) {
                    this.OnClickedCallback();
                }
            }
        });

        this.Connections.Set("MouseClickCon", MouseClickCon);
    }

    public OnClicked(callback: () => void) {
        this.OnClickedCallback = callback;
    }

    public SetFocused(focused: boolean) {
        this.Focused = focused;
    }

    // Setter for size (scale and offset)
    public SetSize(scale: Vector2, offset: Vector2): this {
        this.SizeScale = scale;
        this.SizeOffset = offset;
        return this;
    }

    // Setter for position (scale and offset)
    public SetPosition(scale: Vector2, offset: Vector2): this {
        this.PositionScale = scale;
        this.PositionOffset = offset;
        return this;
    }

    public SetPositionScale(scale: Vector2): this {
        this.PositionScale = scale;
        return this;
    }

    public SetPositionOffset(offset: Vector2): this {
        this.PositionOffset = offset;
        return this;
    }

    public GetDistance(): number {
        return this.Distance;
    }

    public SetDistance(distance: number): this {
        this.Distance = distance;
        return this;
    }

    public SetRaiseHeight(height: number): this {
        this.RaiseHeight = height;
        return this;
    }

    public SetZIndex(zIndex: number): this {
        this.BBUI.ZOffset = zIndex;
        return this;
    }

    public Destroy() {
        // Disconnect all connections
        this.Connections.ForEach((con) => con.Disconnect());
        // Destroy the Part
        this.Part.Destroy();
    }
}*/