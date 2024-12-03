import { Collection } from "shared/modules/Collection/Collection";
import { WidgetPage } from "./WidgetPage";


export class WidgetManager {
    private readonly Connections = new Collection<string, RBXScriptConnection>();
    private readonly ParentFrame: ScrollingFrame & {TemplateButton: TextButton};
    private readonly WidgetPages = new Collection<string, WidgetPage>();

    private DisplayedPage?: WidgetPage;
    private LastButton?: TextButton;
    private OnButtonCallback?: (Page: WidgetPage) => void;

    public constructor(ParentFrame: ScrollingFrame & {TemplateButton: TextButton}) {
        this.ParentFrame = ParentFrame;
    }

    public AddIconToLastButton(Icon: string): this {
        if (this.LastButton === undefined) return this;
        
        const ImageLabel = new Instance("ImageLabel");
        ImageLabel.Image = Icon;
        ImageLabel.Size = new UDim2(0.5, 0, 0.5, 0);
        ImageLabel.Parent = this.LastButton;
        ImageLabel.Visible = true;
        ImageLabel.BackgroundTransparency = 1;
        ImageLabel.Name = "Icon";
        ImageLabel.Position = new UDim2(0, 1, 0.5, 0);
        ImageLabel.AnchorPoint = new Vector2(0, 0.5);

        this.LastButton.TextXAlignment = Enum.TextXAlignment.Right;

        const UARC = new Instance("UIAspectRatioConstraint");
        UARC.Parent = ImageLabel;
        UARC.DominantAxis = Enum.DominantAxis.Height;

        return this;
    }

    public AddPage(WidgetPage: WidgetPage, AutoDisplay = false): this {
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

        if (this.WidgetPages.Size() === 1 && AutoDisplay) {
            this.DisplayedPage = WidgetPage;
            this.DisplayedPage.ShowWidgets();
        } else {
            WidgetPage.HideWidgets();
        }

        this.LastButton = Button;

        return this;
    }

    public OnButton(Button: TextButton) {
        const Page = this.WidgetPages.Get(Button.Name);
        if (Page === undefined) return;
        if (this.DisplayedPage !== undefined) {
            this.DisplayedPage.HideWidgets();
        }

        Page.ShowWidgets();
        if (this.OnButtonCallback !== undefined) {
            this.OnButtonCallback(Page);
        }
        
        this.DisplayedPage = Page;
    }

    public SetOnButtonCallback(Callback: (Page: WidgetPage) => void): this {
        this.OnButtonCallback = Callback;
        return this;
    }

    public UpdateAllWidgets(): this {
        this.WidgetPages.ForEach((Page) => {
            Page.UpdateAll();
        });

        return this;
    }
}