import { Players } from "@rbxts/services";
import { Util } from "shared/modules/Util/Util";
import { BaseWidget } from "./BaseWidget";

declare type TemplateDragBar = StarterGui["MainUI"]["MainFrame"]["Content"]["ScrollingFrame"]["Debug"]["Content"]["SettingsFrame"]["ScrollingFrame"]["TemplateDragBar"];

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const Template = MainUI.MainFrame.Content.ScrollingFrame.Debug.Content.SettingsFrame.ScrollingFrame.TemplateDragBar;

export class DragBarWidget extends BaseWidget<TemplateDragBar, number> {
    private LowerBound = 0;
    private UpperBound = 1;

    private IncDecAmount = 0.1;
    private ToFixed = 2;

    constructor(WidgetName: string, Parent=Template.Parent) {
        super(WidgetName, Template, Parent as GuiObject);
        this.SetWidgetName(WidgetName);
    }

    public override BindEvents() {
        super.BindEvents();

        this.Connections.Set("OnDrag", this.Widget.DragBar.Bar.Handle.UIDragDetector.DragContinue.Connect((inputPos) => {
            this.OnDrag();
        }));

        this.Connections.Set("ManualEnter", this.Widget.DragBar.ManualEntry.FocusLost.Connect(() => {
            this.OnManualEnter();
        }));

        this.Connections.Set("Decrement", this.Widget.DragBar.Dec.Activated.Connect(() => {
            this.OnDecrement();
        }));

        this.Connections.Set("Increment", this.Widget.DragBar.Inc.Activated.Connect(() => {
            this.OnIncrement();
        }));

        return this;
    }

    private FixNumber(value: number) {
        if (this.ToFixed < 0) return value;
        return Util.ToFixed(value, this.ToFixed);
    }

    private GetManualEntryValue() {
        const Value = tonumber(this.Widget.DragBar.ManualEntry.Text);
        if (Value === undefined) return this.LowerBound;
        return this.FixNumber(Value);
    }

    private OnDecrement() {
        const NewValue = math.clamp(this.GetManualEntryValue() - this.IncDecAmount, this.LowerBound, this.UpperBound);
        const Fixed = this.FixNumber(NewValue);
        this.UpdateManualEntry(Fixed);
        this.UpdateHandlePosition(Fixed);
    }

    private OnDrag() {
        const PercentMoved = this.Widget.DragBar.Bar.Handle.Position.X.Scale;
        const NewValue = this.LowerBound + (this.UpperBound - this.LowerBound) * PercentMoved;
        const Fixed = this.FixNumber(NewValue);
        const Clamped = math.clamp(Fixed, this.LowerBound, this.UpperBound);
        this.UpdateManualEntry(Clamped);
    }

    private OnIncrement() {
        const NewValue = math.clamp(this.GetManualEntryValue() + this.IncDecAmount, this.LowerBound, this.UpperBound);
        const Fixed = this.FixNumber(NewValue);
        this.UpdateManualEntry(Fixed);
        this.UpdateHandlePosition(Fixed);
    }

    private OnManualEnter() {
        const NewValue = this.GetManualEntryValue();
        const Fixed = this.FixNumber(NewValue);
        const Clamped = math.clamp(Fixed, this.LowerBound, this.UpperBound);
        this.UpdateManualEntry(Clamped);
        this.UpdateHandlePosition(Clamped);
    }

    /**
     * Sets the bounds of the DragBar
     * @param LowerBound 
     * @param UpperBound
     */
    public SetBounds(LowerBound: number, UpperBound: number): this {
        this.LowerBound = LowerBound;
        this.UpperBound = UpperBound;

        if (this.LowerBound > this.UpperBound) {
            error("LowerBound cannot be greater than UpperBound");
        }

        this.Widget.DragBar.Dec.LowerBound.Text = tostring(this.LowerBound);
        this.Widget.DragBar.Inc.UpperBound.Text = tostring(this.UpperBound);

        return this;
    }

    /**
     * Sets the increment/decrement amount for the DragBar
     * @param IncrementDecrement
     */
    public SetButtonIncrementDecrement(IncrementDecrement: number): this {
        this.IncDecAmount = IncrementDecrement;
        return this;
    }

    /**
     * Sets the number of decimal places to round to
     * @param ToFixed 
     */
    public SetToFixed(ToFixed: number): this {
        this.ToFixed = ToFixed;
        return this;
    }

    public override SetWidgetName(WidgetName: string): this {
        super.SetWidgetName(WidgetName);
        this.Widget.Desc.Text = WidgetName;
        return this;
    }

    private UpdateGradientTransparency(value: number) {
        const UIGradient = this.Widget.DragBar.Bar.UIGradient;
        
        const PercentMoved = (value - this.LowerBound) / (this.UpperBound - this.LowerBound);
        // Ensure the value is clamped between 0 and 1
        const ClampedValue = math.clamp(PercentMoved + 0.01, 0, 1);
    
        // Create a NumberSequence with keypoints:
        // - Transparent up to 'clampedValue'
        // - Fully transparent past 'clampedValue'
        const TransparencySequence = new NumberSequence([
            new NumberSequenceKeypoint(0, 0),               // Start fully opaque
            new NumberSequenceKeypoint(ClampedValue, 0),   // Maintain opacity up to handle position
            new NumberSequenceKeypoint(math.clamp(ClampedValue+0.001, 0, 1), 1),   // Transition to fully transparent
            new NumberSequenceKeypoint(1, 1),               // Remain fully transparent
        ]);
    
        UIGradient.Transparency = TransparencySequence;
    }
    

    private UpdateHandlePosition(value: number) {
        const PercentMoved = (value - this.LowerBound) / (this.UpperBound - this.LowerBound);
        this.Widget.DragBar.Bar.Handle.Position = new UDim2(PercentMoved, 0, 0.5, 0);
    }

    private UpdateManualEntry(value: number) {
        this.Widget.DragBar.ManualEntry.Text = tostring(value);
        this.UpdateGradientTransparency(value);
        this.Action(value);
    }

    protected UpdateWidget(Value: number): this {
        this.UpdateManualEntry(Value);
        this.UpdateHandlePosition(Value);
        return this
    }
}