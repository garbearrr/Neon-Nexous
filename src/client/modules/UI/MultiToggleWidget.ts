import { Players } from "@rbxts/services";
import { BaseWidget } from "./BaseWidget";
import { Collection } from "shared/modules/Collection/Collection";

declare type TemplateMultiToggle = StarterGui["MainUI"]["MainFrame"]["Content"]["ScrollingFrame"]["Debug"]["Content"]["SettingsFrame"]["ScrollingFrame"]["TemplateMultiToggle"];

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const Template = MainUI.MainFrame.Content.ScrollingFrame.Debug.Content.SettingsFrame.ScrollingFrame.TemplateMultiButton;

const MaxButtons = 4;
// ❌ ✅

export class MultiToggleWidget extends BaseWidget<TemplateMultiToggle, [string, boolean][]> {
    private Buttons = new Collection<string, TextButton>();
    private ButtonCallbacks = new Collection<string, (NewValue: boolean) => void>();

    constructor(WidgetName: string) {
        super(WidgetName, Template);
        this.SetWidgetName(WidgetName);
    }

    public AddButton(ButtonName: string, ButtonCallback: (NewValue: boolean) => void): this {
        if (this.Buttons.Size() >= MaxButtons) {
            warn("Max buttons reached for TemplateMultiToggle");
            return this;
        }

        const Button = this.Widget.ButtonArea.TemplateButton.Clone();
        Button.Text = `${ButtonName}: ❌`;
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

    private OnButton(Button: TextButton) {
        const Callback = this.ButtonCallbacks.Get(Button.Name);
        if (Callback !== undefined) {
            const NewValue = Button.Text.find("❌")?.size() > 0;
            Callback(NewValue);
            this.Update();
        }
    }

    public override SetWidgetName(WidgetName: string): this {
        super.SetWidgetName(WidgetName);
        this.Widget.TextArea.Desc.Text = WidgetName;
        return this;
    }

    protected UpdateWidget(Value: [string, boolean][]): this {
        for (const [Key, Val] of Value) {
            const Button = this.Buttons.Get(Key);
            if (Button === undefined) continue;
            const OldText = Button.Text;
            const NewText = Val ? OldText.gsub("❌", "✅") : OldText.gsub("✅", "❌");
            Button.Text = NewText[0];
        }

        return this;
    }
}