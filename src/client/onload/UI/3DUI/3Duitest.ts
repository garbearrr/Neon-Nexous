//import { Workspace, RunService, UserInputService, TweenService, Players } from "@rbxts/services";
//import { Collection } from "shared/modules/Collection/Collection";
//import { Scheduling } from "shared/modules/Scheduling/Scheduling";
//import { ThreeDeePage } from "./ThreeDeePage";

/*
const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const SurfaceGui = PlayerGui.WaitForChild("ThreeDUI") as StarterGui["ThreeDUI"];
const Camera = Workspace.CurrentCamera!;
const GuiPart = Workspace.WaitForChild("GuiPart") as Workspace["GuiPart"];

declare type FramesInScanlines = {
    [K in keyof typeof SurfaceGui["MainFrame"]["Scanlines"]]: typeof SurfaceGui["MainFrame"]["Scanlines"][K] extends Frame ? K : never;
}[keyof typeof SurfaceGui["MainFrame"]["Scanlines"]];

//declare type TemplatePage = typeof SurfaceGui["MainFrame"]["Scanlines"]["Shop"];

// Desired screen space percentages
const DesiredScreenWidthPercentage = 0.75  // 80% of the screen width
const DesiredScreenHeightPercentage = 0.70; // 75% of the screen height

// Fixed distance from the camera
const Distance = 5; // In studs

// Maximum rotation angle
const MaxRotationAngle = math.rad(2.5); // Maximum rotation in radians

const ScanlineTexture = SurfaceGui.MainFrame.Scanlines;
const SLTI = new TweenInfo(12, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, true, 0);
const ActivateTI = new TweenInfo(0.9, Enum.EasingStyle.Elastic, Enum.EasingDirection.InOut, 0, false, 0);
const CloseTI = new TweenInfo(0.5, Enum.EasingStyle.Elastic, Enum.EasingDirection.InOut, 0, false, 0);

const CursorTimeout = 0.75;
const BkSpcTypeTimeout = 0.35;
const BkSpcTimeout = 0.13;
const TypeTimeout = 0.06;

// Doing a class because it's easier to manage state.
class ThreeDUIManager {
    private Active = false;
    private CanExit = false;
    private CurrentPage?: ThreeDeePage;

    private Executing = false;
    private Interrupted = false;
    private LastScreenSize = Camera.ViewportSize;
    private MouseXOffset = 0;
    private MouseYOffset = 0;
    private PendingTitleText = "";
    private ScreenSize = Camera.ViewportSize;

    private CurTween: Tween | undefined;
    private StopInterval: Callback | undefined;

    private readonly Connections = new Collection<string, RBXScriptConnection>();
    private readonly Pages = new Collection<FramesInScanlines, ThreeDeePage>();
    private readonly TitleTexts = new Collection<string, string>();

    public constructor() {
        
    }

    public AddPage(Page: FramesInScanlines, PageInstance: ThreeDeePage) {
        if (this.Pages.Has(Page)) {
            warn(`Page ${Page} already exists in 3DGUI.`);
            return;
        }

        this.Pages.Set(Page, PageInstance);
    }

    private Close() {
        this.Connections.Get("Close")?.Disconnect();
        const OriginalBrightness = SurfaceGui.Brightness;
        const Tween = TweenService.Create(SurfaceGui, CloseTI, {Brightness: 0});
        Tween.Completed.Connect(() => {
            SurfaceGui.Brightness = OriginalBrightness;
            this.Disable();
        });
        Tween.Play();
    }

    public Disable() {
        if (!this.Active) return;
        if (!this.CanExit) return;

        this.Active = false;
        this.CanExit = false;
        this.CurrentPage!.Page.Visible = false;
        this.CurrentPage!.OnClose();
        this.CurrentPage = undefined;

        this.Executing = false;
        this.Interrupted = false;
        this.PendingTitleText = "";

        this.Connections.ForEach((Connection) => Connection.Disconnect());
        this.Connections.Clear();

        if (this.CurTween !== undefined) {
            this.CurTween.Cancel();
            this.CurTween = undefined;
        }

        if (this.StopInterval !== undefined) {
            this.StopInterval();
            this.StopInterval = undefined;
        }

        this.MouseXOffset = 0;
        this.MouseYOffset = 0;

        GuiPart.CFrame = new CFrame(0, -5000, 0);
    }

    public DisplayPage(Page: FramesInScanlines) {
        if (this.CurrentPage !== undefined && this.CurrentPage.Page.Name === Page) {
            return;
        }

        const NewPage = this.Pages.Get(Page);
        if (NewPage === undefined) {
            warn(`Page ${Page} does not exist 3DGUI.`);
            return;
        }

        NewPage.OnOpen();

        this.Connections.Get("Close")?.Disconnect();
        const XCon = NewPage.Page["1_TopBar"].X_Close.Activated.Connect(() => this.Close());
        this.Connections.Set("Close", XCon);

        if (!this.TitleTexts.Has(Page)) {
            this.TitleTexts.Set(Page, NewPage.Page["1_TopBar"].Title.Text);
        }

        if (this.CurrentPage !== undefined) {
            if (this.Executing) {
                this.Interrupted = true;

                while (this.Executing) {
                    wait();
                }

                this.Interrupted = false;
            }

            this.CurrentPage.Page.Visible = false;
            this.CurrentPage.Page["1_TopBar"].Title.Text = this.TitleTexts.Get(this.CurrentPage.Page.Name)!;
            this.CurrentPage.OnClose();

            if (this.StopInterval !== undefined) {
                this.StopInterval();
                this.StopInterval = undefined;
            }

            this.CurrentPage = NewPage;
            NewPage.Page["1_TopBar"].Title.Text = this.PendingTitleText;
            NewPage.Page.Visible = true;
            this.ShowTitle();
            return;
        }

        this.CurrentPage = NewPage;
        NewPage.Page["1_TopBar"].Title.Text = "";
        NewPage.Page.Visible = true;
        this.Active = true;

        const OGBrightness = SurfaceGui.Brightness;
        SurfaceGui.Brightness = 0.5;
        const Tween = TweenService.Create(SurfaceGui, ActivateTI, {Brightness: OGBrightness});
        Tween.Completed.Connect(() => this.CanExit = true);
        Tween.Play();

        const UISCon = UserInputService.InputChanged.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseMovement) {
                const MousePosition = UserInputService.GetMouseLocation();
                this.MouseXOffset = (MousePosition.X - this.ScreenSize.X / 2) / (this.ScreenSize.X / 2);
                this.MouseYOffset = (MousePosition.Y - this.ScreenSize.Y / 2) / (this.ScreenSize.Y / 2);
            }
        });

        this.Connections.Set("UISCon", UISCon);

        this.LastScreenSize = this.ScreenSize;

        const RenderCon = RunService.RenderStepped.Connect(() => {
            const CameraCFrame = Camera.CFrame;

            // Check if the screen size has changed
            this.ScreenSize = Camera.ViewportSize;
            if (this.ScreenSize !== this.LastScreenSize) {
                this.LastScreenSize = this.ScreenSize;
            }

            // Calculate the part's size based on the desired screen percentages
            const fov = math.rad(Camera.FieldOfView); // Convert FOV to radians
            const aspectRatio = this.ScreenSize.X / this.ScreenSize.Y;

            // Frustum height and width at the fixed distance
            const frustumHeight = 2 * Distance * math.tan(fov / 2);
            const frustumWidth = frustumHeight * aspectRatio;

            // Desired part dimensions
            const partHeight = frustumHeight * DesiredScreenHeightPercentage;
            const partWidth = frustumWidth * DesiredScreenWidthPercentage;

            // Update the part's size
            GuiPart.Size = new Vector3(partWidth, partHeight, GuiPart.Size.Z); // Keep the depth (Z) the same

            // Position the part directly in front of the camera at the fixed distance
            let partCFrame = CameraCFrame.mul(new CFrame(0, 0, -Distance));

            // Make the part face the camera
            partCFrame = new CFrame(partCFrame.Position, CameraCFrame.Position);

            // Calculate rotation angles based on mouse position
            const xRotation = this.MouseYOffset * MaxRotationAngle;
            const yRotation = -this.MouseXOffset * MaxRotationAngle;

            // Create rotation CFrame
            const rotationCFrame = CFrame.Angles(xRotation, yRotation, 0);

            // Apply rotation around the part's center
            GuiPart.CFrame = partCFrame.mul(rotationCFrame);
        });

        this.Connections.Set("RenderCon", RenderCon);

        this.CurTween = TweenService.Create(ScanlineTexture, SLTI, {TileSize: new UDim2(1, 0, 2.5, 0)});
        this.CurTween.Play();

        this.ShowTitle();
    }

    public IsActive() {
        return this.Active;
    }

    private IsInterrupted(overwrite=false) {
        if (this.Interrupted) {
            if (overwrite) this.Interrupted = false;
            this.Executing = false;
            return true;
        }

        if (!this.Active) {
            this.Executing = false;
            return true;
        }

        return false;
    }

    private ShowTitle() {
        this.Executing = true;
        const TB = this.CurrentPage!.Page["1_TopBar"];
        this.Interrupted = false;

        while(this.PendingTitleText.size() > 0) {
            this.PendingTitleText = this.PendingTitleText.sub(0, this.PendingTitleText.size() - 1);
            TB.Title.Text = this.PendingTitleText + "_";
            wait(BkSpcTimeout);
            if (this.IsInterrupted()) return;
        }

        wait(BkSpcTypeTimeout);
        if (this.IsInterrupted()) return;
        
        TB.Title.Text = "_";
        const Title = this.TitleTexts.Get(this.CurrentPage!.Page.Name)!;

        for (const char of Title) {
            TB.Title.Text = TB.Title.Text .sub(0, TB.Title.Text.size() - 1) + char + "_";
            this.PendingTitleText += char;
            wait(TypeTimeout);
            if (this.IsInterrupted()) return;
        }

        this.Executing = false;
        if (this.StopInterval !== undefined) this.StopInterval();
        this.StopInterval = Scheduling.SetInterval(() => this.ToggleCursor(TB.Title), CursorTimeout);
    }

    private ToggleCursor(TextLabel: TextLabel) {
        const Text = TextLabel.Text;
        if (Text.sub(Text.size(), Text.size() + 1) === "_") {
            TextLabel.Text = Text.sub(0, Text.size() - 1);
        } else {
            TextLabel.Text = Text + "_";
        }
    }
}

export default new ThreeDUIManager();
*/