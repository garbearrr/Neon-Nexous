import { Players, TweenService } from "@rbxts/services";

const TI = new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUi = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const ActionRow = MainUi.Top["2_Actions"];

const TweenYScale = (Target: TextButton, TargetScale: number) => {
    const TargetSize = new UDim2(Target.Size.X.Scale, Target.Size.X.Offset, TargetScale, Target.Size.Y.Offset);
    const Tween = TweenService.Create(Target, TI, { Size: TargetSize });
    Tween.Play();
}

const Buttons = ActionRow.GetChildren().filter((Child) => Child.IsA("TextButton")) as TextButton[];
for (const Button of Buttons) {
    Button.MouseEnter.Connect(() => TweenYScale(Button, 1.25));
    Button.MouseLeave.Connect(() => TweenYScale(Button, 1));
}