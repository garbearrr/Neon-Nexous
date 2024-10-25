import { BGScroll } from "../MainUI/BGScroll";
import { BaseActionButton } from "./BaseActionButton";

declare type ButtonTemplate = StarterGui["MainUI"]["Top"]["2_Actions"]["2_Inventory"];

export abstract class BaseMainUIActionButton extends BaseActionButton {
    protected readonly Page: Frame;

    public constructor(Button: ButtonTemplate) {
        super(Button);
        this.Page = Button.Page.Value as Frame;
    }

    protected override OnActivated(): void {
        super.OnActivated();
    }

    protected override ToggleOff(): void {}

    protected override ToggleOn(): void {
        BGScroll.ScrollToFrame(this.Page);
        if (!BGScroll.IsActive()) BGScroll.Activate();
    }
}