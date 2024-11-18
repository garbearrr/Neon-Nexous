import { TweenService } from "@rbxts/services";

declare type ButtonTemplate = StarterGui["MainUI"]["Left"]["Actions"]["1_Build"];

export abstract class BaseActionButton {
    protected readonly Button: ButtonTemplate;

    protected readonly ActiveColor: Color3 = Color3.fromHex("#585858");
    protected readonly HoverSize: number = 1.25;

    private readonly OGBGColor: Color3;

    public constructor(Button: ButtonTemplate) {
        this.Button = Button;
        this.OGBGColor = Button.BackgroundColor3;

        this.Button.Activated.Connect(() => this.OnActivated());
        this.Button.Icon.Activated.Connect(() => this.OnActivated());
        this.Button.MouseEnter.Connect(() => this.MouseEnter());
        this.Button.MouseLeave.Connect(() => this.MouseLeave());
    }

    protected MouseEnter(): void {
        this.TweenXScale(this.HoverSize);
        _G.Log("Mouse entered", "ACTION");
    }

    protected MouseLeave(): void {
        this.TweenXScale(1);
    }

    protected IsActivated(): boolean {
        return this.Button.BackgroundColor3 === this.ActiveColor;
    }

    protected OnActivated(): void {
        this.Toggle();
    };

    protected Toggle(): void {
        if (this.Button.BackgroundColor3 === this.ActiveColor) {
            this.ToggleOff();
        } else {
            this.ToggleOn();
        }
    }

    protected ToggleOff(): void {
        this.Button.BackgroundColor3 = this.OGBGColor;
    }

    protected ToggleOn(): void {
        this.Button.BackgroundColor3 = this.ActiveColor;
    }

    private TweenXScale(TargetScale: number): void {
        const TargetSize = new UDim2(TargetScale, this.Button.Size.X.Offset, this.Button.Size.Y.Scale, this.Button.Size.Y.Offset);
        const Tween = TweenService.Create(this.Button, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), { Size: TargetSize });
        Tween.Play();
    }

    private TweenYScale(TargetScale: number): void {
        const TargetSize = new UDim2(this.Button.Size.X.Scale, this.Button.Size.X.Offset, TargetScale, this.Button.Size.Y.Offset);
        const Tween = TweenService.Create(this.Button, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), { Size: TargetSize });
        Tween.Play();
    }
}