import { Players, RunService, ContextActionService, TweenService } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { MainUIPage } from "./MainUIPage";

// Define the type for Image Zones with Fade-In and Fade-Out boundaries
type ImageZone = {
    start: number;         // Starting scroll position of the zone
    fadeStart: number;     // Scroll position where fade-out starts (50%)
    fadeEnd: number;       // Scroll position where fade-out ends (75%)
    endPos: number;        // Ending scroll position of the zone
    image: string;         // Texture ID or URL of the image
};

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const MainFrame = MainUI.WaitForChild("MainFrame") as StarterGui["MainUI"]["MainFrame"];
const Background = MainFrame.WaitForChild("ScrollingBG") as ImageLabel;
const MainContent = MainFrame.WaitForChild("Content") as StarterGui["MainUI"]["MainFrame"]["Content"];
const MainScroll = MainContent.WaitForChild("ScrollingFrame") as StarterGui["MainUI"]["MainFrame"]["Content"]["ScrollingFrame"];

// Configuration Parameters
const Speed = 30; // Duration in seconds for one complete scroll cycle
const ScrollDirection = new Vector2(-1, 1); // Direction of the background scroll
const TilesAcross = 12; // Number of tiles horizontally
const TilesDown = 6; // Number of tiles vertically
const StartingTransparency = Background.ImageTransparency; // Initial transparency of the background
const CustomScrollSpeed = 25; // Speed multiplier for custom scroll
const FadeStartPercentage = 0.5; // 50% of the zone where fade-out starts
const FadeEndPercentage = 0.75;  // 75% of the zone where fade-out ends
const TransparencyThreshold = 0.05; // Threshold to determine when to change images

const FocusTweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut); // Tween duration of 0.5 seconds

// Define the order of images using decals
const ImageOrder = [
    Background.WaitForChild("MH-Boxes-Padded") as Decal,
    Background.WaitForChild("MH-Shop-Padded") as Decal,
    Background.WaitForChild("MH-Cog-Padded") as Decal,
];

// Initialize Image Zones array
let ImageZones: ImageZone[] = [];

// TODO: recalculate zones, scrolling, etc. on resize - even the shop menu grid
// TODO: Fix auto scroll position

export namespace BGScroll {
    let Active = false;
    let Position = new Vector2(0, 0); // Current background position

    const Connections = new Collection<string, RBXScriptConnection>();
    const Frames = [] as MainUIPage[];

    // Variable to track if the mouse is over MainScroll
    let isMouseOverScroll = false;

    // Pending scroll variable
    let pendingScroll: number = 0; // Accumulates scroll deltas
    const ScrollSpeed = 500; // Pixels per second for smooth scrolling

    export const Activate = () => {
        if (Active) return;

        Active = true;

        // Initial setup
        UpdateTileSize();
        
        // Connect to size changes to update tile size dynamically
        const sizeChangeConn = (Background.Parent as Frame)
            .GetPropertyChangedSignal("AbsoluteSize")
            .Connect(() => UpdateTileSize());
        Connections.Set("SizeChange", sizeChangeConn);

        // Connect to the heartbeat to handle scrolling and image transitions
        const updateConn = RunService.Heartbeat.Connect((dt) => OnUpdate(dt));
        Connections.Set("Update", updateConn);

        // Bind the mouse wheel action with high priority to handle custom scrolling
        ContextActionService.BindActionAtPriority(
            "MouseWheelAction", 
            HandleMouseWheel, 
            false,
            Enum.ContextActionPriority.High.Value,
            Enum.UserInputType.MouseWheel
        );

        // Track mouse entering and leaving MainScroll to manage scrolling interaction
        const enterConn = MainScroll.MouseEnter.Connect(() => {
            isMouseOverScroll = true;
            // Optional: print("Mouse entered MainScroll");
        });
        const leaveConn = MainScroll.MouseLeave.Connect(() => {
            isMouseOverScroll = false;
            // Optional: print("Mouse left MainScroll");
        });
        Connections.Set("MouseEnter", enterConn);
        Connections.Set("MouseLeave", leaveConn);

        const CloseConn = MainContent.TopBar.Close.Activated.Connect(() => {
            Deactivate();
        });
        Connections.Set("Close", CloseConn);

        // Initialize Image Zones based on the number of images and frame height
        InitializeImageZones();

        // Initialize the first image based on the first zone
        if (ImageZones.size() > 0) {
            Background.Image = ImageZones[0].image;
            Background.ImageTransparency = StartingTransparency;
        }

        MainFrame.Visible = true; // Show the MainFrame to render the background
        print("BGScroll Activated");
    };

    export const AddFrame = (frame: MainUIPage) => {
        Frames.push(frame);
        InitializeImageZones(); // Recalculate zones whenever a new frame is added
    };

    // Method to focus on a target frame
    export const FocusOnFrame = (targetFrame: Frame) => {
        // Ensure that targetFrame is a child of MainScroll
        if (!targetFrame.IsDescendantOf(MainScroll)) {
            warn(`Target frame ${targetFrame.Name} is not a descendant of MainScroll.`);
            return;
        }

        // Calculate the desired CanvasPosition.Y to center the frame
        const frameOffset = targetFrame.Position.Y.Offset;
        const frameHeight = targetFrame.AbsoluteSize.Y;
        const scrollFrameHeight = MainScroll.AbsoluteSize.Y;

        const targetCanvasPosY = math.clamp(
            frameOffset - (scrollFrameHeight / 2) + (frameHeight / 2),
            0,
            MainScroll.AbsoluteCanvasSize.Y - scrollFrameHeight
        );

        print(`Focusing on frame: ${targetFrame.Name}`);
        print(`Frame Y Offset: ${frameOffset}`);
        print(`Frame Height: ${frameHeight}`);
        print(`Scroll Frame Height: ${scrollFrameHeight}`);
        print(`Calculated target CanvasPosition.Y: ${targetCanvasPosY}`);

        if (!Active) {
            // If the module is not active, immediately set the scroll to the target frame
            MainScroll.CanvasPosition = new Vector2(MainScroll.CanvasPosition.X, targetCanvasPosY);
            print(`Set CanvasPosition directly to: ${MainScroll.CanvasPosition}`);
        } else {
            // If the module is active, calculate the pending scroll delta
            const currentScrollY = MainScroll.CanvasPosition.Y;
            const deltaScroll = targetCanvasPosY - currentScrollY;
            pendingScroll += deltaScroll;
            print(`Added ${deltaScroll} to pendingScroll. New pendingScroll: ${pendingScroll}`);
        }
    };
    
    export const Deactivate = () => {
        if (!Active) return;

        Active = false;

        MainFrame.Visible = false; // Hide the MainFrame to prevent rendering

        // Disconnect all connections to prevent memory leaks
        Connections.ForEach((Conn) => Conn.Disconnect());
        Connections.Clear();

        // Unbind the mouse wheel action
        ContextActionService.UnbindAction("MouseWheelAction");

        print("BGScroll Deactivated");
    };

    /**
     * Calculates the transparency based on normalized scroll position and thresholds.
     * @param p - Normalized scroll position within the zone (0 to 1).
     * @param t1 - Fade-Out Start Threshold (0 < t1 < t2 < 1).
     * @param t2 - Fade-Out End Threshold (t1 < t2 < 1).
     * @param startingTransparency - The initial transparency value (0 to 1).
     * @returns The calculated transparency value.
     */
    function CalculateTransparency(
        p: number,
        t1: number,
        t2: number,
        startingTransparency: number
    ): number {
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

    // Function to handle mouse wheel scrolling
    const HandleMouseWheel = (actionName: string, inputState: Enum.UserInputState, inputObject: InputObject) => {
        // Only handle the input when it's a MouseWheel scroll change
        if (inputObject.UserInputType === Enum.UserInputType.MouseWheel && inputState === Enum.UserInputState.Change) {
            if (isMouseOverScroll) {
                // Calculate the scroll delta based on the mouse wheel input
                const delta = inputObject.Position.Z * CustomScrollSpeed;
                
                // Accumulate the pending scroll
                pendingScroll += -delta; // Negative to invert the scroll direction if necessary
                print(`Mouse wheel scrolled. Added ${-delta} to pendingScroll. New pendingScroll: ${pendingScroll}`);
                
                // Prevent the default camera zoom by consuming the input
                return Enum.ContextActionResult.Sink;
            }
        }

        // Allow the input to propagate if not over the scroll frame
        return Enum.ContextActionResult.Pass;
    };
    
    // Function called every frame to handle scrolling and image transitions
    const OnUpdate = (deltaTime: number) => {
        // Apply pending scroll smoothly
        if (pendingScroll !== 0) {
            // Calculate the amount to scroll this frame
            const scrollDelta = ScrollSpeed * deltaTime;
            
            // Determine the direction of the scroll
            const scrollDirection = pendingScroll > 0 ? 1 : -1;
            
            // Calculate the actual scroll amount for this frame
            const actualScroll = math.min(math.abs(pendingScroll), scrollDelta) * scrollDirection;
            
            // Update the CanvasPosition
            MainScroll.CanvasPosition = new Vector2(
                MainScroll.CanvasPosition.X,
                math.clamp(MainScroll.CanvasPosition.Y + actualScroll, 0, MainScroll.AbsoluteCanvasSize.Y - MainScroll.AbsoluteSize.Y)
            );
            
            // Decrease the pendingScroll
            pendingScroll -= actualScroll;
            print(`Applied scroll: ${actualScroll}. Remaining pendingScroll: ${pendingScroll}`);
        }
        
        // Continue with other updates
        ScrollBackground(deltaTime);
        UpdateBackgroundImageBasedOnScroll();
    };
    
    // Function to handle background scrolling based on speed and direction
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
    };

    // Function to update the tile size of the background image to maintain a consistent look
    const UpdateTileSize = () => {
        const ParentSize = (Background.Parent as Frame).AbsoluteSize; // Get the parent size

        // Calculate the smallest tile dimension based on the parent size and the number of tiles
        const MinTileSize = math.min(ParentSize.X / TilesAcross, ParentSize.Y / TilesDown);

        // Update the tile size on the ImageLabel to keep it square
        Background.TileSize = UDim2.fromOffset(MinTileSize, MinTileSize);

        // Optional: print(`Tile Size Updated: ${MinTileSize}`);
    };
    
    // Function to update the background image and handle fade-in and fade-out transitions based on scroll position
    const UpdateBackgroundImageBasedOnScroll = () => {
        if (ImageZones.size() === 0) return; // No zones defined
        
        const ScrollPosition = MainScroll.CanvasPosition.Y;

        // Determine which zone the current scroll position falls into
        for (const zone of ImageZones) {
            if (ScrollPosition >= zone.start && ScrollPosition < zone.endPos) {
                // Calculate the normalized scroll position within the zone (0 to 1)
                const p = (ScrollPosition - zone.start) / (zone.endPos - zone.start);

                // Calculate the transparency based on the normalized position and thresholds
                const transparency = CalculateTransparency(p, FadeStartPercentage, FadeEndPercentage, StartingTransparency);
                
                // Update the background image transparency
                Background.ImageTransparency = transparency;

                // Determine which image should be displayed based on the zone index
                const zoneIndex = ImageZones.indexOf(zone);
                if (Background.Image !== ImageOrder[zoneIndex].Texture) {
                    Background.Image = ImageOrder[zoneIndex].Texture;
                }

                return; // Current zone handled, no need to check further
            }
        }

        // Handle scroll position beyond all defined zones (loop back to the first image)
        const lastZone = ImageZones[ImageZones.size() - 1];
        if (ScrollPosition >= lastZone.endPos) {
            // Loop back to the first image
            Background.Image = ImageZones[0].image;
            Background.ImageTransparency = StartingTransparency; // Ensure it starts fully visible
            MainScroll.CanvasPosition = new Vector2(MainScroll.CanvasPosition.X, 0); // Reset scroll position
            // Optional: print("Looped back to first image.");
        }
    };

    // Function to initialize Image Zones with fade boundaries
    const InitializeImageZones = () => {
        ImageZones = []; // Clear existing zones if any

        if (Frames.size() === 0) {
            warn("No frames found in MainScroll. Cannot initialize image zones.");
            return;
        }

        const FrameHeight = Frames[0]?.Page.AbsoluteSize.Y || 100; // Default frame height if undefined

        ImageOrder.forEach((decal, index) => {
            const zoneStart = index * FrameHeight;
            const zoneFadeStart = zoneStart + (FadeStartPercentage * FrameHeight); // 50% of the zone
            const zoneFadeEnd = zoneStart + (FadeEndPercentage * FrameHeight);     // 75% of the zone
            const zoneEnd = zoneStart + FrameHeight;                             // 100% of the zone

            ImageZones.push({
                start: zoneStart,
                fadeStart: zoneFadeStart,
                fadeEnd: zoneFadeEnd,
                endPos: zoneEnd,
                image: decal.Texture, // Assuming 'Texture' holds the decal texture URL or ID
            });
        });

        // Optional: Handle additional zones if needed
        // For example, if you want the last image to extend beyond the last frame
    };
}
