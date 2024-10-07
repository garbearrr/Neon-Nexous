import { Players, Workspace } from "@rbxts/services";
import { BaseItemMenuGrid } from "../BaseItemMenuGrid";
import { Collection } from "shared/modules/Collection/Collection";

import { BGScroll } from "../BGScroll";
import { Money } from "client/modules/Money/Money";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const ShopFrame = MainUI.MainFrame.Content.ScrollingFrame.Shop;

class ShopMenuGrid extends BaseItemMenuGrid {
    protected DescFrame: typeof ShopFrame["Content"]["Desc"];

    private Clicked: string | undefined;
    private Connections: Collection<string, RBXScriptConnection> = new Collection();

    public constructor(Frame: typeof ShopFrame) {
        super(Frame);

        this.DescFrame = Frame["Content"]["Desc"];
        this.PopulateMenu();
    }

    protected ItemSource() {
        const FoundItems = new Collection<string, {ItemId: string, Name: string, Item: Part}>();
        const Items = Workspace.FindFirstChild("Items") as Workspace["Items"];
        const TypeFolders = Items.GetChildren().filter(c => c.IsA("Folder")) as Folder[];

        for (const Folder of TypeFolders) {
            const Items = Folder.GetChildren() as PossibleItems[];

            for (const Item of Items) {
                const ID = Item.Name;
                const Name = Item.Stats.ItemName.Value;
                FoundItems.Set(ID, {ItemId: ID, Name: Name, Item});
            }
        }

        return FoundItems;
    }

    private OnBuy(Price: string) {
        Money.RemoveMoney(new BigNumber(Price));
    }

    protected override OnCellAdded(Cells: GuiButton[], ItemId: string, Name: string, Item: PossibleItems): void {
        for (const Cell of Cells) {
            const HoverConnection = Cell.MouseEnter.Connect(() => this.OnCellHovered(Cell, ItemId, Name, Item));
            const ClickConnection = Cell.Activated.Connect(() => this.OnCellClicked(Cell, ItemId, Name, Item));
            const UnhoverConnection = Cell.MouseLeave.Connect(() => this.OnCellUnhovered(Cell, ItemId, Name, Item));

            this.Connections.Set(ItemId + "hover" + Cell.Name, HoverConnection);
            this.Connections.Set(ItemId + "click" + Cell.Name, ClickConnection);
            this.Connections.Set(ItemId + "unhover" + Cell.Name, UnhoverConnection);
        }
    }

    private OnCellClicked(Cells: GuiButton, ItemId: string, Name: string, Item: PossibleItems) {
        if (this.Clicked !== undefined && this.Clicked === ItemId) {
            this.DescFrame.Visible = false;
            this.Clicked = undefined;
            return;
        }

        this.Clicked = ItemId;
        this.UpdateDesc(Name, Item.Stats.Cost.Value + "", true);
    }

    private OnCellHovered(Cells: GuiButton, ItemId: string, Name: string, Item: PossibleItems) {
        if (this.Clicked !== undefined) return;
       this.UpdateDesc(Name, Item.Stats.Cost.Value + "", false);
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
    }

    private UpdateDesc(Name: string, Price: string, ConnectBuy=false) {
        this.DescFrame["2_Name"].Text = Name;
        this.DescFrame["3_Buy"].Text = Price;

        if (ConnectBuy) {
            this.Connections.Get("Buy")?.Disconnect();
            const BuyConnection = this.DescFrame["3_Buy"].Activated.Connect(() => this.OnBuy(Price));
            this.Connections.Set("Buy", BuyConnection);
        }
    }
}

BGScroll.AddFrame(new ShopMenuGrid(ShopFrame));