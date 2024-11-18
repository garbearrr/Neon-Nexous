import { Players, TweenService } from "@rbxts/services";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";


export namespace UI.Level {
    const Player = Players.LocalPlayer;
    const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
    const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

    const ActiveTweens = new Map<string, Tween>();

    const Level = MainUI.Left.Actions.Level;
    const HoverSize = new UDim2(3, 0, 3, 0);
    const UnhoverSize = new UDim2(1, 0, 1, 0);

    const ExpandedInfo = Level.ExpandedInfo;
    const ExpandPosHover = new UDim2(1.1, 0, 0.5, 0);
    const ExpandPosUnhover = new UDim2(0, 0, 0.5, 0);

    const CancelAndClearTweens = () => {
        ActiveTweens.forEach((Tween) => {
            Tween.Cancel();
        });

        ActiveTweens.clear();
    }

    export const GetLevelUI = () => {
        return Level;
    }

    const OnHover = () => {
        TweenXScale(HoverSize, "Hover");

        ExpandedInfo.Visible = true;
        const ExpandTween = TweenService.Create(ExpandedInfo, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), { Position: ExpandPosHover });
        ActiveTweens.set("Expand", ExpandTween);
        ExpandTween.Play();

        const ColorBar = ExpandedInfo.LevelBarArea.BarArea.EmptyBar.ColorBar;
        const OriginalColorBarSize = ColorBar.Size.X.Scale;
        ColorBar.Size = new UDim2(0, 0, 1, 0);

        const ColorBarTween = new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
        const ColorTween = TweenService.Create(ColorBar, ColorBarTween, { Size: new UDim2(OriginalColorBarSize, 0, 1, 0) });
        ActiveTweens.set("ColorBar", ColorTween);
        ColorTween.Play();
    }

    const TweenXScale = (TargetScale: UDim2, Name: string, onComplete = () => {}) => {
        const Tween = TweenService.Create(Level, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), { Size: TargetScale });
        ActiveTweens.set(Name, Tween);
        
        const Conn = Tween.Completed.Connect(() => {
            onComplete();
            Conn.Disconnect();
        });

        Tween.Play();
    }

    const Unhover = () => {
        CancelAndClearTweens();

        TweenXScale(UnhoverSize, "Unhover");

        const ExpandTween = TweenService.Create(ExpandedInfo, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), { Position: ExpandPosUnhover });
        ActiveTweens.set("Expand", ExpandTween);
        const EConn = ExpandTween.Completed.Connect(() => {
            ExpandedInfo.Visible = false;
            EConn.Disconnect();
        });
        ExpandTween.Play();

        const ColorBar = ExpandedInfo.LevelBarArea.BarArea.EmptyBar.ColorBar;
        const ColorBarTween = new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
        const ColorTween = TweenService.Create(ColorBar, ColorBarTween, { Size: new UDim2(0, 0, 1, 0) });
        ActiveTweens.set("ColorBar", ColorTween);
        ColorTween.Play();
    }

    export const UpdateGraphic = (XP: BigNumber, XPToNext: BigNumber, Lvl: number) => {
        const PercentComplete = XP.Divide(XPToNext).ToNumber();

        const NewTransparency = new NumberSequence([
            new NumberSequenceKeypoint(0, 0),
            new NumberSequenceKeypoint(0, math.clamp(1 - PercentComplete * 2, 0, 1)),
            new NumberSequenceKeypoint(math.clamp(PercentComplete * 2 - 1, 0, 1), 0),
            new NumberSequenceKeypoint(1, 1)
        ]);

        Level.FillSun.UIGradient.Transparency = NewTransparency;

        //ExpandedInfo.LevelBarArea.BarArea.EmptyBar.Percentage.Text = `${PercentComplete * 100}%`;
        // Current Amount / Total Amount
        ExpandedInfo.LevelBarArea.BarArea.MoneyToGo.Text = `${XP.ToAbbreviatedString(false, 3)} / ${XPToNext.ToAbbreviatedString(false, 3)}`;
        ExpandedInfo.LevelBarArea.CurrentLevel.Level.Text = Lvl + "";
        ExpandedInfo.LevelBarArea.NextLevel.Level.Text = (Lvl + 1) + "";

        const ColorBar = ExpandedInfo.LevelBarArea.BarArea.EmptyBar.ColorBar;

        if (!ExpandedInfo.Visible) {
            ColorBar.Size = new UDim2(PercentComplete, 0, 1, 0);
            return;
        };

        const ColorBarTween = new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
        
        const ColorTween = TweenService.Create(ColorBar, ColorBarTween, { Size: new UDim2(PercentComplete, 0, 1, 0) });
        ActiveTweens.set("ColorBar", ColorTween);
        ColorTween.Play();
    }

    export const UpdateLevel = (Lvl: number) => {
        Level.LevelText.Text = Lvl + "";
    }

    const OnColorBarExpand = () => {
        const PercentageText = ExpandedInfo.LevelBarArea.BarArea.EmptyBar.Percentage;
        const ColorBar = ExpandedInfo.LevelBarArea.BarArea.EmptyBar.ColorBar;
        const ColorBarXScale = ColorBar.Size.X.Scale;
        PercentageText.Text = `${math.floor(ColorBarXScale * 100)}%`;
        PercentageText.Position = new UDim2(ColorBarXScale, 0, 0.5, 0);
        if (ColorBarXScale > 0.5) {
            PercentageText.AnchorPoint = new Vector2(1, 0);
            PercentageText.TextXAlignment = Enum.TextXAlignment.Right;
        } else {
            PercentageText.AnchorPoint = new Vector2(0, 0);
            PercentageText.TextXAlignment = Enum.TextXAlignment.Left;
        }
    }

    Level.MouseEnter.Connect(() => OnHover());
    Level.MouseLeave.Connect(() => Unhover());
    ExpandedInfo.LevelBarArea.BarArea.EmptyBar.ColorBar.GetPropertyChangedSignal("Size").Connect(() => OnColorBarExpand());
}