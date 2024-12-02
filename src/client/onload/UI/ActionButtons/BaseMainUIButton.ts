import { BGScroll } from "../MainUI/BGScroll";
import { BaseActionButton } from "./BaseActionButton";

declare type ButtonTemplate = StarterGui["MainUI"]["Left"]["Actions"]["2_Inventory"];

export abstract class BaseMainUIActionButton extends BaseActionButton {
    protected readonly Page: Frame;

    public constructor(Button: ButtonTemplate) {
        super(Button);
        this.Page = Button.Page.Value as Frame;
    }

    protected override OnActivated(): void {
        super.OnActivated();
    }

    protected override ToggleOff(): void {
        super.ToggleOff();
        BGScroll.Deactivate();
    }

    protected override ToggleOn(): void {
        super.ToggleOn();
        BGScroll.ScrollToFrame(this.Page);
        if (!BGScroll.IsActive()) BGScroll.Activate();
    }
}