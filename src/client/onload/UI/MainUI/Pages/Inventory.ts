import { Players } from "@rbxts/services";
import { BaseItemMenuGrid } from "../BaseItemMenuGrid";
import { Collection } from "shared/modules/Collection/Collection";

import { BGScroll } from "../BGScroll";
import { Placement } from "client/modules/Placement/Placement";
import BuildActionButton from "../../ActionButtons/BuildActionButton";
import { Inventory } from "client/modules/Inventory/Inventory";
import { Common } from "shared/modules/Common/Common";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const InvFrame = MainUI.MainFrame.Content.ScrollingFrame.Inventory;
const TemplateInvCell = InvFrame.Content.ItemFrame.TemplateRow.TemplateItem;

class InventoryMenuGrid extends BaseItemMenuGrid {
    protected DescFrame: typeof InvFrame["Content"]["Desc"];

    private Clicked: string | undefined;
    private Connections: Collection<string, RBXScriptConnection> = new Collection();

    public constructor(Frame: typeof InvFrame) {
        super(Frame);

        this.DescFrame = Frame["Content"]["Desc"];
        this.PopulateMenu();
    }

    protected ItemSource() {
        const FoundItems = new Collection<string, {ItemId: string, Name: string, Item: Part, Img: string}>();
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

    private OnPlace(ID: string) {
        if (Placement.IsActive()) Placement.Deactivate();
        Placement.Activate(tonumber(ID) || 10000);
        BuildActionButton.SetOn();
        BGScroll.Deactivate();
    }

    protected override OnCellAdded(Cells: GuiButton[], ItemId: string, Name: string, Item: PossibleItems, Img: string): void {
        for (const Cell of Cells) {
            const HoverConnection = Cell.MouseEnter.Connect(() => this.OnCellHovered(Cell, ItemId, Name, Item, Img));
            const ClickConnection = Cell.Activated.Connect(() => this.OnCellClicked(Cell, ItemId, Name, Item, Img));
            const UnhoverConnection = Cell.MouseLeave.Connect(() => this.OnCellUnhovered(Cell, ItemId, Name, Item));

            this.Connections.Set(ItemId + "hover" + Cell.Name, HoverConnection);
            this.Connections.Set(ItemId + "click" + Cell.Name, ClickConnection);
            this.Connections.Set(ItemId + "unhover" + Cell.Name, UnhoverConnection);
        }

        const [TButton, _IButton] = Cells as [typeof TemplateInvCell, GuiButton];
        TButton.Amount.Text = Inventory.GetItem(ItemId) ? tostring(Inventory.GetItem(ItemId)) : "0";
        if (TButton.Amount.Text.size() > 3) TButton.Amount.Text = "99+";
    }

    private OnCellClicked(Cells: GuiButton, ItemId: string, Name: string, Item: PossibleItems, Img: string) {
        if (this.Clicked !== undefined && this.Clicked === ItemId) {
            this.DescFrame.Visible = false;
            this.Clicked = undefined;
            return;
        }

        this.Clicked = ItemId;
        this.UpdateDesc(Name, ItemId, Img, true);
    }

    private OnCellHovered(Cells: GuiButton, ItemId: string, Name: string, Item: PossibleItems, Img: string) {
        if (this.Clicked !== undefined) return;
       this.UpdateDesc(Name, ItemId, Img, false);
       this.DescFrame.Visible = true;
    }

    private OnCellUnhovered(Cells: GuiButton, ItemId: string, Name: string, Item: PossibleItems) {
        if (this.Clicked !== undefined) return;
        this.DescFrame.Visible = false
    }

    public override OnClose() {
        super.OnClose();
        //this.Connections.ForEach(Conn => Conn.Disconnect());
        this.DescFrame.Visible = false;
        this.Clicked = undefined;
        this.DestroyAllCells();
    }

    public override OnOpen() {
        super.OnOpen();
        this.PopulateMenu();
    }

    private UpdateDesc(Name: string, ID: string, Img: string, ConnectBuy=false) {
        this.DescFrame["2_Name"].Text = Name;
        this.DescFrame["1_ItemImg"].ImageButton.Image = Img;

        if (ConnectBuy) {
            this.Connections.Get("Buy")?.Disconnect();
            const BuyConnection = this.DescFrame["3_Buy"].Activated.Connect(() => this.OnPlace(ID));
            this.Connections.Set("Buy", BuyConnection);
        }
    }
}

BGScroll.AddFrame(new InventoryMenuGrid(InvFrame));