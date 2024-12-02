// StarterGui/LoadingScreen (ScreenGui)

import { ContentProvider, Lighting, Players, ReplicatedFirst, RunService, StarterGui, TweenService, Workspace } from "@rbxts/services";

// HELP FUNCTIONS:

const rotateCameraAroundPoint = (
    target: Vector3,
    rotationSpeed: number = math.rad(10), // radians per second
    distanceX: number = 100,
    distanceY: number = 175
): () => void => {
    const camera = Workspace.CurrentCamera;
    if (!camera) {
        warn("No current camera found.");
        return () => {};
    }

    let angle = 0;

    // Connection to RenderStepped
    const connection = RunService.RenderStepped.Connect((deltaTime) => {
        // Increment the angle based on rotation speed and elapsed time
        angle += rotationSpeed * deltaTime;

        // Calculate the new position in the XZ plane
        const offsetX = math.cos(angle) * distanceX;
        const offsetZ = math.sin(angle) * distanceX;

        // Set Y position based on distanceY
        const position = new Vector3(
            target.X + offsetX,
            target.Y + distanceY,
            target.Z + offsetZ
        );

        // Update the camera's CFrame to look at the target
        camera.CFrame = CFrame.lookAt(position, target);
    });

    // Return a disconnect function to stop the rotation when needed
    return () => {
        connection.Disconnect();
    };
}

const clamp = (Value: number, Min: number, Max: number) => {
    return math.min(math.max(Value, Min), Max);
}

// Lock Player Movement
const Humanoid = Players.LocalPlayer.Character?.WaitForChild("Humanoid") as Humanoid;
Humanoid.WalkSpeed = 0;
Humanoid.JumpPower = 0;

ReplicatedFirst.RemoveDefaultLoadingScreen();
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false);

const Parent = script.Parent!.Parent as StarterGui["LoadingScreen"];

Parent.Enabled = true;

// Disable maingui
const MainUI = Parent.Parent!.WaitForChild("MainUI") as ScreenGui
MainUI.Enabled = false;

const Main = Parent.WaitForChild("Main") as CanvasGroup;
const BG = Main.WaitForChild("BG") as Frame;
const Blur = Main.WaitForChild("Blur") as Frame;
const Container = BG.WaitForChild("Container") as Frame;
const Logo = Container.WaitForChild("Logo") as ImageLabel;

const PauseEvery = (Parent.WaitForChild("PauseEvery") as NumberValue).Value;

const PlayButton = Container.WaitForChild("PlayButton") as CanvasGroup;
const FadeLevel = Container.WaitForChild("FadeLevel") as CanvasGroup;
const FadeHint = Container.WaitForChild("FadeHint") as CanvasGroup;

const FillSun = FadeLevel.WaitForChild("Level").WaitForChild("FillSun") as ImageLabel;
const SunGrad = FillSun.WaitForChild("UIGradient") as UIGradient;
const Hint = FadeHint.WaitForChild("Hint") as TextLabel;

const MainPlayButton = PlayButton.WaitForChild("MainButton") as TextButton;

const ClientRemote = ReplicatedFirst.WaitForChild("BeginClient") as BindableEvent;
const ClientRes = ReplicatedFirst.WaitForChild("ClientResponse") as BindableEvent;

const AssetsToPreload = [
    ...Workspace.WaitForChild("Items").GetDescendants(),
    ...Workspace.WaitForChild("Plots").GetDescendants(),
    //...ReplicatedStorage.GetDescendants(),
    ...Players.LocalPlayer.WaitForChild("PlayerGui").GetDescendants(),
]

const AssetCount = AssetsToPreload.size();

for (let i = 0; i < AssetCount; i++) {
    const Asset = AssetsToPreload[i];
    const Percentage = i / AssetCount;

    ContentProvider.PreloadAsync([Asset]);
    Hint.Text = `Loading ${i}/${AssetCount}...`;

    SunGrad.Transparency = new NumberSequence([
        new NumberSequenceKeypoint(0, 0),
        new NumberSequenceKeypoint(0, clamp(0.5 - Percentage, 0, 0.5)),
        new NumberSequenceKeypoint(1, clamp(2 - Percentage * 2, 0, 1))
    ]);

    if (i % PauseEvery === 0) {
        wait();
    }
}

// Fade SunGrad, Hint, and BG out by tweening
const TI = new TweenInfo(
    1, // Time in seconds
    Enum.EasingStyle.Quad, // Easing style
    Enum.EasingDirection.Out, // Easing direction
    0, // Repeat count
    false, // Reverses
    0 // Delay time
);

// Create tweens for each UI element to fade out
const fadeLevelTween = TweenService.Create(
    FadeLevel,
    TI,
    { GroupTransparency: 1 }
);

const fadeHintTween = TweenService.Create(
    FadeHint,
    TI,
    { GroupTransparency: 1 }
);

const logoTween = TweenService.Create(
    Logo,
    TI,
    { Size: new UDim2(0.8, 0, 0.8, 0) }
);

const bgTween = TweenService.Create(
    BG,
    TI,
    { Transparency: 1 }
);

const PlayButtonTween = TweenService.Create(
    PlayButton,
    TI,
    { GroupTransparency: 0 }
);

const mainFade = TweenService.Create(
    Main,
    TI,
    { GroupTransparency: 1 }
);

let camDiscon: () => void;
const OnPlayPress = () => {
    mainFade.Completed.Connect(() => {
        Parent.Enabled = false;
        MainUI.Enabled = true;
    });

    while (logoTween !== undefined && logoTween.PlaybackState !== Enum.PlaybackState.Completed) wait();

    mainFade.Play();
    camDiscon();

    Blur.Destroy();
    // Stop blur
    Lighting.FindFirstChild("DepthOfField")!.Destroy();

    ClientRemote.Fire();
};

// Wait for all tweens to complete before proceeding
fadeHintTween.Completed.Connect(() => {
    logoTween.Play();
    bgTween.Play();
    PlayButtonTween.Play();

    const Target = (Workspace.WaitForChild("Environment").WaitForChild("Base") as Model).WorldPivot.Position;
    camDiscon = rotateCameraAroundPoint(Target);

    const PlayConn = MainPlayButton.Activated.Connect(() => {
        PlayConn.Disconnect();
        while (PlayButtonTween !== undefined && PlayButtonTween.PlaybackState !== Enum.PlaybackState.Completed) wait();
        OnPlayPress();
    });
});

// Play all tweens
fadeLevelTween.Play();
fadeHintTween.Play();