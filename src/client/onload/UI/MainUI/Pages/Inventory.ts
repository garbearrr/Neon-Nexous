import { Players } from "@rbxts/services";
import { BaseItemMenuGrid } from "../BaseItemMenuGrid";
import { Collection } from "shared/modules/Collection/Collection";

import { BGScroll } from "../BGScroll";
import { Placement } from "client/modules/Placement/Placement";
import BuildActionButton from "../../ActionButtons/BuildActionButton";
import { Inventory } from "client/modules/Inventory/Inventory";
import { Common } from "shared/modules/Common/Common";
import { StatMap } from "../DescData";
import InvActionButton from "../../ActionButtons/InvActionButton";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const InvFrame = MainUI.MainFrame.Content.ScrollingFrame.Inventory;
const TemplateInvCell = InvFrame.Content.ItemFrame.TemplateRow.TemplateItem;

class InventoryMenuGrid extends BaseItemMenuGrid {
    protected DescFrame: typeof InvFrame["Content"]["Desc"];

    private Clicked: number | undefined;
    private Connections: Collection<string, RBXScriptConnection> = new Collection();
    private StatConnections = new Collection<string, RBXScriptConnection>();

    public constructor(Frame: typeof InvFrame) {
        super(Frame);

        this.DescFrame = Frame["Content"]["Desc"];
        this.PopulateMenu();
    }

    protected ItemSource() {
        const FoundItems = new Collection<number, {ItemId: number, Name: string, Item: Part, Img: string}>();
        const InventoryItems = Inventory.GetAllItems();

        for (const [ID, _Amount] of InventoryItems.Entries()) {
            const Item = Common.GetItemById(tonumber(ID) || 10000);
            if (Item === undefined) continue;
            const Name = Item.Stats.ItemName.Value;
            const Img = Item.Stats.Icon.Value;
            FoundItems.Set(ID, {ItemId: ID, Name: Name, Item, Img});
        }

        return FoundItems;
    }

    private OnPlace(ID: number) {
        if (Placement.IsActive()) Placement.Deactivate();
        Placement.Activate(ID);
        BuildActionButton.SetOn();
        InvActionButton.OnActivated();
        BGScroll.Deactivate();
    }

    protected override OnCellAdded(Cells: GuiButton[], ItemId: number, Name: string, Item: PossibleItems, Img: string): void {
        // Default item showing
        if (this.Clicked === undefined) {
            this.OnCellHovered(Cells[0], ItemId, Name, Item, Img);
        }

        for (const Cell of Cells) {
            const HoverConnection = Cell.MouseEnter.Connect(() => this.OnCellHovered(Cell, ItemId, Name, Item, Img));
            const ClickConnection = Cell.Activated.Connect(() => this.OnCellClicked(Cell, ItemId, Name, Item, Img));
            //const UnhoverConnection = Cell.MouseLeave.Connect(() => this.OnCellUnhovered(Cell, ItemId, Name, Item));

            this.Connections.Set(ItemId + "hover" + Cell.Name, HoverConnection);
            this.Connections.Set(ItemId + "click" + Cell.Name, ClickConnection);
            //this.Connections.Set(ItemId + "unhover" + Cell.Name, UnhoverConnection);
        }

        const [TButton, _IButton] = Cells as [typeof TemplateInvCell, GuiButton];
        TButton.Amount.Text = Inventory.GetItem(ItemId) ? tostring(Inventory.GetItem(ItemId)) : "0";
        if (TButton.Amount.Text.size() > 3) TButton.Amount.Text = "99+";
    }

    private OnCellClicked(Cells: GuiButton, ItemId: number, Name: string, Item: PossibleItems, Img: string) {
        if (this.Clicked !== undefined && this.Clicked === ItemId) {
            this.DescFrame.Visible = false;
            this.Clicked = undefined;
            return;
        }

        this.Clicked = ItemId;
        this.UpdateDesc(Name, ItemId, Img, Item, true);
    }

    private OnCellHovered(Cells: GuiButton, ItemId: number, Name: string, Item: PossibleItems, Img: string) {
        if (this.Clicked !== undefined) return;
       this.UpdateDesc(Name, ItemId, Img, Item, false);
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
        this.DestroyAllCells();
    }

    public override OnOpen() {
        super.OnOpen();
    }

    public override OnFrameChange() {
        super.OnFrameChange();
        this.PopulateMenu();
        this.StatConnections.ForEach(Conn => Conn.Disconnect());
    }

    private UpdateDesc(Name: string, ID: number, Img: string, Item: PossibleItems, ConnectBuy=false) {
        this.DescFrame.Container.ItemName.Text = Name;
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
            const BuyConnection = this.DescFrame.Container.Buy.Activated.Connect(() => this.OnPlace(ID));
            this.Connections.Set("Buy", BuyConnection);
        }
    }
}

BGScroll.AddFrame(new InventoryMenuGrid(InvFrame));