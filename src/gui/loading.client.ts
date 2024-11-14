// StarterGui/LoadingScreen (ScreenGui)

import { ContentProvider, ReplicatedFirst, StarterGui, TweenService, Workspace } from "@rbxts/services";

ReplicatedFirst.RemoveDefaultLoadingScreen();
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false);

const Parent = script.Parent!.Parent as StarterGui["LoadingScreen"];

Parent.Enabled = true;

// Disable maingui
const MainUI = Parent.Parent!.WaitForChild("MainUI") as ScreenGui
MainUI.Enabled = false;

const BG = Parent.WaitForChild("BG") as typeof Parent["BG"];
const Container = BG.WaitForChild("Container") as typeof Parent["BG"]["Container"];
const Logo = Container.WaitForChild("Logo") as typeof Parent["BG"]["Container"]["Logo"];

const PauseEvery = (Parent.WaitForChild("PauseEvery") as NumberValue).Value;

const Sun = Container.WaitForChild("Level").WaitForChild("Sun") as typeof Container["Level"]["Sun"];
const FillSun = Container.WaitForChild("Level").WaitForChild("FillSun") as typeof Container["Level"]["FillSun"];
const Border = Container.WaitForChild("Level").WaitForChild("Border").WaitForChild("UIStroke") as typeof Container["Level"]["Border"]["UIStroke"];
const LvlBG = Container.WaitForChild("Level").WaitForChild("BG") as typeof Container["Level"]["BG"];
const SunGrad = FillSun.WaitForChild("UIGradient") as typeof Container["Level"]["FillSun"]["UIGradient"];
const Hint = Container.WaitForChild("Hint") as typeof Container["Hint"];
const HintStroke = Hint.WaitForChild("UIStroke") as typeof Container["Hint"]["UIStroke"];

const ClientRemote = ReplicatedFirst.WaitForChild("BeginClient") as BindableEvent;
const ClientRes = ReplicatedFirst.WaitForChild("ClientResponse") as BindableEvent;

const AssetsToPreload = [
    ...Workspace.WaitForChild("Items").GetDescendants(),
    ...Workspace.WaitForChild("Plots").GetDescendants(),
    //...ReplicatedStorage.GetDescendants(),
    ...StarterGui.GetDescendants()
]

const AssetCount = AssetsToPreload.size();

const clamp = (Value: number, Min: number, Max: number) => {
    return math.min(math.max(Value, Min), Max);
}

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
const sunGradTween = TweenService.Create(
    FillSun,
    TI,
    { ImageTransparency: 1 } // Fully transparent
);

const sunTween = TweenService.Create(
    Sun,
    TI,
    { ImageTransparency: 1 } // Fully transparent
);

const hintTween = TweenService.Create(
    Hint,
    TI,
    { TextTransparency: 1, TextStrokeTransparency: 1 } // Fully transparent text
);

const hintStrokeTween = TweenService.Create(
    HintStroke,
    TI,
    { Transparency: 1 } // Fully transparent stroke
);

const bgTween = TweenService.Create(
    BG,
    TI,
    { BackgroundTransparency: 1 } // Fully transparent background
);

const LvlBGTween = TweenService.Create(
    LvlBG,
    TI,
    { BackgroundTransparency: 1 } // Fully transparent background
);

const borderTween = TweenService.Create(
    Border,
    TI,
    { Transparency: 1 } // Fully transparent border
);

// Play all tweens
sunGradTween.Play();
sunTween.Play();
hintTween.Play();
hintStrokeTween.Play();
borderTween.Play();
LvlBGTween.Play();
bgTween.Play();

const logoTween = TweenService.Create(
    Logo,
    TI,
    { Size: new UDim2(0.8, 0, 0.8, 0) }
);


// Wait for all tweens to complete before proceeding
bgTween.Completed.Connect(() => {
    logoTween.Play();
    ClientRemote.Fire();
});

const logoFade = TweenService.Create(
    Logo,
    TI,
    { ImageTransparency: 1 }
);

const Conn = ClientRemote.Event.Connect(() => {
    logoFade.Completed.Connect(() => {
        Parent.Enabled = false;
    });
    MainUI.Enabled = true;

    while (logoTween != undefined && logoTween.PlaybackState !== Enum.PlaybackState.Completed) wait();

    logoFade.Play();
    Conn.Disconnect();
});