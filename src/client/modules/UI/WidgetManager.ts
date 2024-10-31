import { Collection } from "shared/modules/Collection/Collection";
import { WidgetPage } from "./WidgetPage";


export class WidgetManager {
    private readonly Connections = new Collection<string, RBXScriptConnection>();
    private readonly ParentFrame: ScrollingFrame & {TemplateButton: TextButton};
    private readonly WidgetPages = new Collection<string, WidgetPage>();

    private DisplayedPage?: WidgetPage;

    public constructor(ParentFrame: ScrollingFrame & {TemplateButton: TextButton}) {
        this.ParentFrame = ParentFrame;
    }

    public AddPage(WidgetPage: WidgetPage): this {
        this.WidgetPages.Set(WidgetPage.GetName(), WidgetPage);

        const Button = this.ParentFrame.TemplateButton.Clone();
        Button.Text = WidgetPage.GetName();
        Button.Name = WidgetPage.GetName();
        Button.Parent = this.ParentFrame;
        Button.Visible = true;
        Button.LayoutOrder = this.WidgetPages.Size();

        const Conn = Button.Activated.Connect(() => {
            this.OnButton(Button);
        });

        this.Connections.Set(Button.Name, Conn);

        if (this.WidgetPages.Size() === 1) {
            this.DisplayedPage = WidgetPage;
            this.DisplayedPage.ShowWidgets();
        } else {
            WidgetPage.HideWidgets();
        }

        return this;
    }

    public OnButton(Button: TextButton) {
        const Page = this.WidgetPages.Get(Button.Name);
        if (Page === undefined) return;
        if (this.DisplayedPage !== undefined) {
            this.DisplayedPage.HideWidgets();
        }

        Page.ShowWidgets();
        this.DisplayedPage = Page;
    }
}