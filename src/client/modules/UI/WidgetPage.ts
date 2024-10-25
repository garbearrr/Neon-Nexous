import { Collection } from "shared/modules/Collection/Collection";
import { BaseWidget } from "./BaseWidget";


export class WidgetPage {
    private readonly Parent: GuiObject;
    private readonly Widgets = new Collection<string, BaseWidget<GuiObject, any>>();

    public constructor(Parent: GuiObject) {
        this.Parent = Parent;
    }

    public AddWidget<T extends BaseWidget<GuiObject, any>>(Widget: T): this {
        this.Widgets.Set(Widget.GetName(), Widget);
        Widget.SetParent(this.Parent);
        return this;
    }

    public GetWidget<T extends BaseWidget<GuiObject, any>>(Name: string): T {
        return this.Widgets.Get(Name) as T;
    }

    public HideWidgets(): this {
        this.Widgets.ForEach((Widget) => {
            Widget.SetWidgetVisibility(false);
            Widget.UnbindEvents();
        });
        return this;
    }

    public RemoveWidget(Name: string): this {
        const Widget = this.Widgets.Get(Name);
        if (Widget !== undefined) {
            Widget.Destroy();
            this.Widgets.Delete(Name);
        }
        return this;
    }

    public ShowWidgets(): this {
        this.Widgets.ForEach((Widget) => {
            Widget.SetWidgetVisibility(true);
            Widget.BindEvents();
        });
        return this;
    }
}