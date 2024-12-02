import { Players } from "@rbxts/services";
import { BaseWidget } from "./BaseWidget";

declare type TemplateWMWidget = StarterGui["Widgets"]["WidgetManagerWidget"];

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const Widgets = PlayerGui.WaitForChild("Widgets") as StarterGui["Widgets"];
const Template = Widgets.WidgetManagerWidget;

export class WidgetManagerWidget extends BaseWidget<TemplateWMWidget, void> {
    protected LineCount = 0;

    constructor(WidgetName: string) {
        super(WidgetName, Template);
        this.SetWidgetName(WidgetName);
    }

    public MakeUpdateVisible(): this {
        // No need to update
        return this;
    }

    protected UpdateWidget(Value: void): this {
        // No need to update
        return this;
    }
}