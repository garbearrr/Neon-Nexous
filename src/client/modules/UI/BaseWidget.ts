import { Collection } from "shared/modules/Collection/Collection";

export abstract class BaseWidget<TemplateWidget extends GuiObject, T> {
    protected readonly Connections = new Collection<string, RBXScriptConnection>();
    protected readonly Widget: TemplateWidget;

    protected Name: string;

    protected ActionCallback?: (Value: T) => void;
    protected UpdateCallback?: () => T;

    constructor(WidgetName: string, WidgetTemplate: TemplateWidget, Parent: GuiObject) {
        this.Name = WidgetName;

        this.Widget = WidgetTemplate.Clone();
        this.Widget.Name = this.Name;
        this.Widget.Parent = Parent;
        this.Widget.Visible = true;

        this.BindEvents();
    }

    protected Action(Value: T) {
        if (this.ActionCallback !== undefined) {
            this.ActionCallback(Value);
        }
    }

    /**
     * Binds all events, essentially activates the widget
     */
    public BindEvents(): this {
        this.UnbindEvents();
        return this;
    }

    /**
     * Destroys the widget, unbinding all events and removing it from the parent
     */
    public Destroy() {
        this.UnbindEvents();
        this.Widget.Destroy();
    }

    /**
     * Sets the action callback that is called when the widget is interacted with
     * @param Callback
     */
    public SetActionCallback(Callback: (Value: T) => void): this {
        this.ActionCallback = Callback;
        return this;
    }

    /**
     * Sets the name of the widget
     * @param WidgetName 
     */
    public SetWidgetName(WidgetName: string): this {
        this.Name = WidgetName;
        this.Widget.Name = WidgetName;
        return this;
    }

    /**
     * Sets the visibility of the widget
     * @param Visible 
     */
    public SetWidgetVisibility(Visible: boolean): this {
        this.Widget.Visible = Visible;
        return this;
    }

    /**
     * Sets the update callback that can provide the widget with new data
     * @param Callback
     */
    public SetUpdateCallback(Callback: () => T): this {
        this.UpdateCallback = Callback;
        return this;
    }

    /**
     * Unbinds all events
     */
    public UnbindEvents(): this {
        this.Connections.ForEach((Connection) => {
            Connection.Disconnect();
        });
        return this;
    }

    /**
     * Updates the widget with the set update callback (refreshes the widget)
     */
    public Update(): this {
        if (this.UpdateCallback !== undefined) {
            this.UpdateWidget(this.UpdateCallback());
        }
        return this;
    }

    protected abstract UpdateWidget(Value: T): this;
}