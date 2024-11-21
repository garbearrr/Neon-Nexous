import { Players, Workspace } from "@rbxts/services";
import { BaseItemMenuGrid } from "../BaseItemMenuGrid";
import { Collection } from "shared/modules/Collection/Collection";

import { BGScroll } from "../BGScroll";
import { Money } from "client/modules/Money/Money";
import { StatMap } from "../DescData";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const ShopFrame = MainUI.MainFrame.Content.ScrollingFrame.Shop;

class ShopMenuGrid extends BaseItemMenuGrid {
    protected DescFrame: typeof ShopFrame["Content"]["Desc"];

    private Clicked: number | undefined;
    private Connections: Collection<string, RBXScriptConnection> = new Collection();
    private StatConnections = new Collection<string, RBXScriptConnection>();

    public constructor(Frame: typeof ShopFrame) {
        super(Frame);

        this.DescFrame = Frame["Content"]["Desc"];
        this.PopulateMenu();
    }

    protected ItemSource() {
        const FoundItems = new Collection<number, {ItemId: number, Name: string, Item: Part, Img: string}>();
        const Items = Workspace.FindFirstChild("Items") as Workspace["Items"];
        const TypeFolders = Items.GetChildren().filter(c => c.IsA("Folder")) as Folder[];

        for (const Folder of TypeFolders) {
            const Items = Folder.GetChildren() as PossibleItems[];

            for (const Item of Items) {
                const ID = Item.Stats.ItemId.Value;
                const Name = Item.Stats.ItemName.Value;
                const Img = Item.Stats.Icon.Value;
                FoundItems.Set(ID, {ItemId: ID, Name: Name, Item, Img});
            }
        }

        return FoundItems;
    }

    private OnBuy(ID: number) {
        Money.BuyItem(ID);
    }

    protected override OnCellAdded(Cells: GuiButton[], ItemId: number, Name: string, Item: PossibleItems, Img: string): void {
        for (const Cell of Cells) {
            const HoverConnection = Cell.MouseEnter.Connect(() => this.OnCellHovered(Cell, ItemId, Name, Item, Img));
            const ClickConnection = Cell.Activated.Connect(() => this.OnCellClicked(Cell, ItemId, Name, Item, Img));
            const UnhoverConnection = Cell.MouseLeave.Connect(() => this.OnCellUnhovered(Cell, ItemId, Name, Item));

            this.Connections.Set(ItemId + "hover" + Cell.Name, HoverConnection);
            this.Connections.Set(ItemId + "click" + Cell.Name, ClickConnection);
            this.Connections.Set(ItemId + "unhover" + Cell.Name, UnhoverConnection);
        }
    }

    private OnCellClicked(Cells: GuiButton, ItemId: number, Name: string, Item: PossibleItems, Img: string) {
        if (this.Clicked !== undefined && this.Clicked === ItemId) {
            this.DescFrame.Visible = false;
            this.Clicked = undefined;
            return;
        }

        this.Clicked = ItemId;
        this.UpdateDesc(Name, Item.Stats.Cost.Value + "", Img, Item, ItemId, true);
    }

    private OnCellHovered(Cells: GuiButton, ItemId: number, Name: string, Item: PossibleItems, Img: string) {
        if (this.Clicked !== undefined) return;
       this.UpdateDesc(Name, Item.Stats.Cost.Value + "", Img, Item, ItemId, false);
       this.DescFrame.Visible = true;
    }

    private OnCellUnhovered(Cells: GuiButton, ItemId: number, Name: string, Item: PossibleItems) {
        if (this.Clicked !== undefined) return;
        this.DescFrame.Visible = false
    }

    public override OnClose() {
        super.OnClose();
        //this.Connections.ForEach(Conn => Conn.Disconnect());
        this.DescFrame.Visible = false;
        this.Clicked = undefined;
        this.StatConnections.ForEach(Conn => Conn.Disconnect());
    }

    private UpdateDesc(Name: string, Price: string, Img: string, Item: PossibleItems, ID: number, ConnectBuy=false) {
        this.DescFrame.Container.ItemName.Text = Name;
        this.DescFrame.Container.Buy.Text = Price;
        this.DescFrame.Container.IconContainer.Icon.Image = Img;

        const Stats = this.DescFrame.Container.StatsFrame.StatsFrame.Statistics;

        for (const Child of Stats.Left.GetChildren()) {
            if (Child.IsA("Frame")) Child.Destroy();
        }

        for (const Child of Stats.Right.GetChildren()) {
            if (Child.IsA("Frame")) Child.Destroy();
        }

        this.StatConnections.ForEach(Conn => Conn.Disconnect());

        let lr = 0;
        for (const Stat of Item.Stats.GetChildren() as ValueBase[]) {
            const StatData = StatMap.get(`${Item.Parent?.Name || ""}${Stat.Name}`);
            if (StatData === undefined) continue;

            const {hoverText, img} = StatData;

            const LR = lr % 2 === 0 ? Stats.Left : Stats.Right;

            const StatEntry = Stats.StatEntry.Clone();
            StatEntry.Name = Stat.Name;
            StatEntry.StatIcon.Image = img;
            StatEntry.StatText.Text = (Stat.Value+"" === "-1") ? "None" : Stat.Value+"";
            StatEntry.Parent = LR;
            StatEntry.Visible = true;

            StatEntry.StatIcon.Info.Text = hoverText;
            this.StatConnections.Set(`${Stat.Name}_enter`, StatEntry.StatIcon.MouseEnter.Connect(() => {
                StatEntry.StatIcon.Info.Visible = true;
                
                StatEntry.StatIcon.Info.AnchorPoint = (LR === Stats.Left) ? new Vector2(0, 0) : new Vector2(1, 0);
                StatEntry.StatIcon.Info.Position = (LR === Stats.Left) ? new UDim2(1, 5, 0, 0) : new UDim2(0, -5, 0, 0);
            }));
            this.StatConnections.Set(`${Stat.Name}_leave`, StatEntry.StatIcon.MouseLeave.Connect(() => {
                StatEntry.StatIcon.Info.Visible = false;
            }));
            lr++;
        }

        this.DescFrame.Container.StatsFrame.StatsFrame.Description.DescText.Text = Item.Stats.Description.Value;

        if (ConnectBuy) {
            this.Connections.Get("Buy")?.Disconnect();
            const BuyConnection = this.DescFrame.Container.Buy.Activated.Connect(() => this.OnBuy(ID));
            this.Connections.Set("Buy", BuyConnection);
        }
    }
}

BGScroll.AddFrame(new ShopMenuGrid(ShopFrame));