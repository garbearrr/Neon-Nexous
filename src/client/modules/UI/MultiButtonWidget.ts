import { Players } from "@rbxts/services";
import { BaseWidget } from "./BaseWidget";
import { Collection } from "shared/modules/Collection/Collection";

declare type TemplateMultiButton = StarterGui["MainUI"]["MainFrame"]["Content"]["ScrollingFrame"]["Debug"]["Content"]["SettingsFrame"]["ScrollingFrame"]["TemplateMultiButton"];

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const Template = MainUI.MainFrame.Content.ScrollingFrame.Debug.Content.SettingsFrame.ScrollingFrame.TemplateMultiButton;

const MaxButtons = 4;

export class MultiButtonWidget extends BaseWidget<TemplateMultiButton, string> {
    private Buttons = new Collection<string, GuiButton>();
    private ButtonCallbacks = new Collection<string, (Button: GuiButton) => void>();

    constructor(WidgetName: string) {
        super(WidgetName, Template);
        this.SetWidgetName(WidgetName);
    }

    public AddButton(ButtonName: string, ButtonCallback: (Button: GuiButton) => void): this {
        if (this.Buttons.Size() >= MaxButtons) {
            warn("Max buttons reached for MultiButtonWidget");
            return this;
        }

        const Button = this.Widget.ButtonArea.TemplateButton.Clone();
        Button.Text = ButtonName;
        Button.Name = ButtonName;
        Button.Parent = this.Widget.ButtonArea;
        Button.Visible = true;
        Button.LayoutOrder = this.Buttons.Size();
        this.Buttons.Set(ButtonName, Button);
        this.ButtonCallbacks.Set(Button.Name, ButtonCallback);
        return this;
    }

    public override BindEvents(): this {
        super.BindEvents();

        for (const Button of this.Buttons.Values()) {
            const Conn = Button.Activated.Connect(() => {
                this.OnButton(Button);
            });

            this.Connections.Set(Button.Name, Conn);
        }

        this.Connections.Set("Update", this.Widget.TextArea.Update.Activated.Connect(() => {
            this.Update();
        }));

        return this;
    }

    public MakeUpdateVisible() {
        this.Widget.TextArea.Update.Visible = true;
        return this;
    }

    private OnButton(Button: GuiButton) {
        const Callback = this.ButtonCallbacks.Get(Button.Name);
        if (Callback !== undefined) {
            Callback(Button);
        }
    }

    public SetInfo(Info: string): this {
        this.Widget.TextArea.Info.Text = Info;
        return this;
    }

    public override SetWidgetName(WidgetName: string): this {
        super.SetWidgetName(WidgetName);
        this.Widget.TextArea.Desc.Text = WidgetName;
        return this;
    }

    protected UpdateWidget(Value: string): this {
        this.SetInfo(Value);
        return this;
    }
}