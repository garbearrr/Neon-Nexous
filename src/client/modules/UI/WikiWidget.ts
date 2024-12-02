import { Players } from "@rbxts/services";
import { BaseWidget } from "./BaseWidget";

declare type TemplateWikiWidget = StarterGui["Widgets"]["WikiWidget"];

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const Widgets = PlayerGui.WaitForChild("Widgets") as StarterGui["Widgets"];
const Template = Widgets.WikiWidget;

export class WikiWidget extends BaseWidget<TemplateWikiWidget, void> {
    protected LineCount = 0;

    constructor(WidgetName: string) {
        super(WidgetName, Template);
        this.SetWidgetName(WidgetName);
    }

    public AddLine(Line: string): this {
        const Clone = this.Widget.Content.TemplateLine.Clone();
        Clone.Text = Line;
        Clone.Parent = this.Widget.Content;
        Clone.Visible = true;
        Clone.LayoutOrder = this.LineCount++;

        return this;
    }

    public AddImage(Link: string, Height: number, Width: number): this {
        const Clone = this.Widget.Content.TemplateImage.Clone();
        Clone.Image = Link;
        Clone.Parent = this.Widget.Content;
        Clone.Visible = true;
        Clone.LayoutOrder = this.LineCount++;
        Clone.Size = new UDim2(0, Width, 0, Height);

        // Set Clone child UiAspectRatioConstraint to Height and Width ratio where Width is the dominant axis
        const AspectRatio = Clone.UIAspectRatioConstraint;
        AspectRatio.AspectRatio = Width / Height;

        return this;
    }

    public MakeUpdateVisible(): this {
        // No need to have update visible
        return this;
    }

    private ResizeSFrame(): void {
        const UILL = this.Widget.Content.UIListLayout;
        const Padding = UILL.Padding.Offset;

        let EHeight = 0;
        const Children = this.Widget.Content.GetChildren() as GuiObject[];

        for (const Child of Children) {
            if (Child.IsA("UIComponent")) continue;
            if (Child.Visible === false) continue;
            EHeight += Child.AbsoluteSize.Y;
            EHeight += Padding;
        }

        if (Children.size() > 0) {
            EHeight += Children[Children.size() - 1].AbsoluteSize.Y;
            EHeight += Padding;
        }
        
        const SFrame = this.Widget.Content;
        SFrame.CanvasSize = new UDim2(0, 0, 0, EHeight);
    }
    
    public override Update(): this {
        super.Update();
        this.ResizeSFrame();
        return this;
    }

    protected UpdateWidget(Value: void): this {
        return this;
    }
}