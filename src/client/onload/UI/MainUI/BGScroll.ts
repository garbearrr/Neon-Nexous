import { Players, RunService, TweenService } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { MainUIPage } from "./MainUIPage";
import { Placement } from "client/modules/Placement/Placement";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const MainFrame = MainUI.WaitForChild("MainFrame") as StarterGui["MainUI"]["MainFrame"];
const Background = MainFrame.WaitForChild("ScrollingBG") as ImageLabel;
const MainContent = MainFrame.WaitForChild("Content") as StarterGui["MainUI"]["MainFrame"]["Content"];
const MainScroll = MainContent.WaitForChild("ScrollingFrame") as StarterGui["MainUI"]["MainFrame"]["Content"]["ScrollingFrame"];

const Speed = 30; // Duration in seconds for one complete scroll cycle
const ScrollDirection = new Vector2(-1, 1); // Direction of the background scroll
const TilesAcross = 12; // Number of tiles horizontally
const TilesDown = 6; // Number of tiles vertically
const StartingTransparency = Background.ImageTransparency; // Initial transparency of the background
const CustomScrollSpeed = 25; // Speed multiplier for custom scroll
const FadeStartPercentage = 0.5; // 50% of the zone where fade-out starts
const FadeEndPercentage = 0.75;  // 75% of the zone where fade-out ends
const TweenDuration = 0.8; // Duration of the tween to scroll to a frame
const TI = new TweenInfo(TweenDuration, Enum.EasingStyle.Exponential, Enum.EasingDirection.Out);

const ImageOrder = [
    Background.WaitForChild("MH-Boxes-Padded") as Decal,
    Background.WaitForChild("MH-Shop-Padded") as Decal,
    Background.WaitForChild("MH-Cog-Padded") as Decal,
    Background.WaitForChild("NN-Grad-Padded") as Decal,
    Background.WaitForChild("MH-Bug-Padded") as Decal,
];

export namespace BGScroll {
    let Active = false;
    let Position = new Vector2(0, 0); // Current background position
    let CurTween = undefined as Tween | undefined;

    const Connections = new Collection<string, RBXScriptConnection>();
    const Frames = [] as MainUIPage[];

    export const Activate = () => {
        if (Active) return;

        Active = true;

        UpdateTileSize();

        for (const Frame of Frames) {
            Frame.OnOpen();
        }

        // Connect to size changes to update tile size dynamically
        const SizeChangeConn = (Background.Parent as Frame)
            .GetPropertyChangedSignal("AbsoluteSize")
            .Connect(() => UpdateTileSize());
        Connections.Set("SizeChange", SizeChangeConn);

        const CloseConn = MainContent.TopBar.BarContent.Sparkle.Close.Activated.Connect(() => {
            Deactivate();
        });
        Connections.Set("Close", CloseConn);

        /*const ScrollConn = MainScroll.GetPropertyChangedSignal("CanvasPosition").Connect(() => {
            OnScroll();
        });
        Connections.Set("Scroll", ScrollConn);*/

        const UpdateConn = RunService.Heartbeat.Connect((dt) => OnUpdate(dt));
        Connections.Set("Update", UpdateConn);

        MainFrame.Visible = true; // Show the MainFrame
        Placement.PausePlacement();
        _G.Log("Activated BGScroll", "BGScroll");
    }

    export const AddFrame = (Frame: MainUIPage) => {
        Frames.push(Frame);
    }

    const CalculateTransparency = (
        p: number,
        t1: number,
        t2: number,
        startingTransparency: number
    ): number => {
        if (p < t1) {
            // Display Zone
            return startingTransparency;
        } else if (p >= t1 && p < t2) {
            // Fade-Out Zone
            const progress = (p - t1) / (t2 - t1);
            return startingTransparency + progress * (1 - startingTransparency);
        } else if (p >= t2 && p <= 1) {
            // Fade-In Zone
            const progress = (p - t2) / (1 - t2);
            return 1 - progress * (1 - startingTransparency);
        } else {
            // Out of bounds, default to starting transparency
            return startingTransparency;
        }
    }

    export const Deactivate = () => {
        if (!Active) return;

        Active = false;

        MainFrame.Visible = false; // Hide the MainFrame to prevent rendering

        // Disconnect all connections to prevent memory leaks
        Connections.ForEach((Conn) => Conn.Disconnect());
        Connections.Clear();

        for (const Frame of Frames) {
            Frame.OnClose();
        }

        Placement.UnpausePlacement();
        _G.Log("Deactivated BGScroll", "BGScroll");
    };

    export const IsActive = () => Active;

    const OnScroll = () => {
        const CurrentPosition = MainScroll.CanvasPosition;
        // Find which zone we are in (all frames are the same height)
        const FrameHeight = Frames[0].Page.AbsoluteSize.Y;
        const CurrentFrame = math.floor(CurrentPosition.Y / FrameHeight);
        const ZoneStart = CurrentFrame * FrameHeight;

        const p = (CurrentPosition.Y - ZoneStart) / FrameHeight;
        const Transparency = CalculateTransparency(p, FadeStartPercentage, FadeEndPercentage, StartingTransparency);

        Background.ImageTransparency = Transparency;
        
        if (Background.Image === ImageOrder[CurrentFrame].Texture) return;
        Background.Image = ImageOrder[CurrentFrame].Texture;
    }

    const OnUpdate = (deltaTime: number) => {
        if (!Active) return;

        ScrollBackground(deltaTime);
    }

    const ScrollBackground = (deltaTime: number) => {
        // Calculate the position change based on speed and direction
        const moveSpeed = deltaTime * (1 / Speed); // How much to move per frame (scaled by deltaTime)
        Position = Position.add(ScrollDirection.mul(moveSpeed)); // Update position in both X and Y

        // Wrap the position based on direction to create a continuous scrolling effect
        if (ScrollDirection.X !== 0 && math.abs(Position.X) >= 1) {
            Position = new Vector2(0, Position.Y); // Reset X position
        }
        if (ScrollDirection.Y !== 0 && math.abs(Position.Y) >= 1) {
            Position = new Vector2(Position.X, 0); // Reset Y position
        }

        // Update the background's position
        Background.Position = UDim2.fromScale(Position.X, Position.Y);
    }

    export const ScrollToFrame = (TargetFrame: Frame) => {
        if (!TargetFrame.IsDescendantOf(MainScroll)) {
            warn(`Target frame ${TargetFrame.Name} is not a descendant of MainScroll.`);
            return;
        }

        const Index = Frames.findIndex((Frame) => Frame.Page === TargetFrame);
        if (Index === -1) {
            warn(`Target frame ${TargetFrame.Name} is not registered in BGScroll.`);
            return;
        }

        Frames[Index].OnFrameChange();

        const FrameHeight = Frames[0].Page.AbsoluteSize.Y;
        const TargetCanvasPosY = Index * FrameHeight;

        Background.Image = ImageOrder[Index].Texture;
        MainContent.TopBar.BarContent.Sparkle.Title.Text = TargetFrame.Name;

        if (!Active) {
            // If the module is not active, immediately set the scroll to the target frame
            MainScroll.CanvasPosition = new Vector2(MainScroll.CanvasPosition.X, TargetCanvasPosY);
            //OnScroll();
            _G.Log(`Scrolled to frame ${TargetFrame.Name} ${TargetCanvasPosY}`, "BGScroll");
        } else {
            if (CurTween) CurTween.Cancel(); // Cancel the current tween if it exists
            // If the module is active, calculate tween to the target frame
            const tween = TweenService.Create(MainScroll, TI, {
                CanvasPosition: new Vector2(0, TargetCanvasPosY),
            });

            CurTween = tween;
            tween.Completed.Connect(() => {
                CurTween = undefined;
            });

            tween.Play();
            _G.Log(`Tweened to frame ${TargetFrame.Name}`, "BGScroll");
        }
    }

    const UpdateTileSize = () => {
        const ParentSize = (Background.Parent as Frame).AbsoluteSize; // Get the parent size

        // Calculate the smallest tile dimension based on the parent size and the number of tiles
        const MinTileSize = math.min(ParentSize.X / TilesAcross, ParentSize.Y / TilesDown);

        // Update the tile size on the ImageLabel to keep it square
        Background.TileSize = UDim2.fromOffset(MinTileSize, MinTileSize);

        _G.Log(`Updated tile size to ${MinTileSize}`, "BGScroll");
    };
}