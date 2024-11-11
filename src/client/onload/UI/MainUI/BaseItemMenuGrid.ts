import { CollectionService, Players } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";
import { Util } from "shared/modules/Util/Util";
import { MainUIPage } from "./MainUIPage";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

declare type TemplatePage = StarterGui["MainUI"]["MainFrame"]["Content"]["ScrollingFrame"]["Shop"];

export abstract class BaseItemMenuGrid extends MainUIPage {
    protected readonly Menu: TemplatePage;

    private SizeChangeConnection: RBXScriptConnection | undefined;

    private readonly OGCellSizeData: UDim2;
    private readonly OGCellSize: number;
    private readonly ContentFrame: TemplatePage["Content"]["ItemFrame"];
    private readonly TemplateRow: TemplatePage["Content"]["ItemFrame"]["TemplateRow"];

    protected ActivationTI = new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
    protected CellsPerRow = 6;
    protected CellTag = "ShopCell";
    protected RowTag = "ShopRow";

    protected constructor(Frame: TemplatePage) {
        super(Frame);
        this.Menu = Frame;

        Frame.Visible = true;
        //this.SetNotVisPosition();

        this.ContentFrame = Frame.Content.ItemFrame;
        this.TemplateRow = this.ContentFrame.TemplateRow;
        this.TemplateRow.Visible = false;
        this.TemplateRow.TemplateItem.Visible = false;
        //this.TemplateRow.TemplateItem.ViewportFrame.Model["10000"].Destroy();

        this.OGCellSizeData = this.ContentFrame.UIGridLayout.CellSize;
        this.OGCellSize = this.OGCellSizeData.Y.Offset;
        //Frame["1_Bar"].Bar["2_Close"].Activated.Connect(() => this.OnClose());
    }

    private ConnectSizeChange() {
        this.SizeChangeConnection?.Disconnect();

        const DebouncedPopulate = Scheduling.Debounce(() => this.PopulateMenu(), 0.2);
        
        this.SizeChangeConnection = MainUI.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
            if (!this.Menu.Visible) return;
            DebouncedPopulate();
        });
    }

    protected DestroyAllCells() {
        const ExistingCells = this.ContentFrame.GetDescendants().filter(c => CollectionService.HasTag(c, this.CellTag)) as (typeof this.TemplateRow.TemplateItem)[];
        for (const Cell of ExistingCells) {
            Cell.Destroy();
        }
    }

    private GenerateCells() {
        const FoundItems = this.ItemSource();
        const Sorted = FoundItems.Sort((a, b) => (tonumber(a.ItemId) || 0) - (tonumber(b.ItemId) || 0));

        const NewCells = [];
        for (const {ItemId, Name, Item, Img} of Sorted.Values()) {
            const CellClone = this.TemplateRow.TemplateItem.Clone();
            CellClone.Parent = this.ContentFrame;
            CollectionService.AddTag(CellClone, this.CellTag);

            CellClone.Visible = true;
            CellClone.ImageButton.Image = Img;
            CellClone.LayoutOrder = tonumber(ItemId) || 0;
            NewCells.push(CellClone);

            this.OnCellAdded([CellClone, CellClone.ImageButton], ItemId, Name, Item, Img);
        }

        return NewCells;
    }

    protected abstract ItemSource(): Collection<number, {ItemId: number, Name: string, Item: Part, Img: string}>;

    protected OnCellAdded(Buttons: GuiButton[], ItemId: number, Name: string, Item: Part, Img: string): void {

    }

    public override OnClose() {
        this.SizeChangeConnection?.Disconnect();
    }

    public override OnOpen() {
        this.ConnectSizeChange();
    }

    protected PopulateMenu() {
        let ExistingCells = this.ContentFrame.GetDescendants().filter(c => CollectionService.HasTag(c, this.CellTag)) as (typeof this.TemplateRow.TemplateItem)[];
        if (ExistingCells.size() <= 0) {
            ExistingCells = this.GenerateCells();
        }
        ExistingCells.sort((a, b) => a.LayoutOrder < b.LayoutOrder);

        const TemplateRowWidth = this.TemplateRow.AbsoluteSize.X;
        const CellsInRow = TemplateRowWidth / this.OGCellSize;
        const NewRatio = CellsInRow / this.CellsPerRow;
        const NewCellSize = this.OGCellSize * NewRatio;
        this.ContentFrame.UIGridLayout.CellSize = new UDim2(this.OGCellSizeData.X, new UDim(0, NewCellSize));

        const Rows = math.ceil(ExistingCells.size() / this.CellsPerRow);
        const Chunked = Util.SplitArray<typeof this.TemplateRow.TemplateItem>(ExistingCells, this.CellsPerRow);
        const ExistingRows = this.ContentFrame.GetChildren().filter(c => CollectionService.HasTag(c, this.RowTag)) as (typeof this.TemplateRow)[];

        for (let i = 0; i < Rows; i++) {
            const Row = Chunked[i];
            const RowClone = this.TemplateRow.Clone();
            RowClone.Name = `Row_${i}`;
            RowClone.Parent = this.ContentFrame;
            CollectionService.AddTag(RowClone, this.RowTag);

            RowClone.Visible = true;
            RowClone.Size = new UDim2(1, 0, 0, NewCellSize);

            Row.forEach((Cell, Index) => {
                Cell.Parent = RowClone;
                Cell.Position = new UDim2(0, Index * NewCellSize, 0, 0);
            });

            if (i === Rows - 1 && Row.size() < this.CellsPerRow) {
                for (let j = Row.size(); j < this.CellsPerRow; j++) {
                    const CellClone = this.TemplateRow.TemplateItem.Clone();
                    CellClone.Parent = RowClone;
                    CellClone.Position = new UDim2(0, j * NewCellSize, 0, 0);
                    CellClone.Visible = true;
                    CellClone.ImageButton.Visible = false;
                    CellClone.UIStroke.Enabled = false;
                    CellClone.LayoutOrder = 999999;
                }
            }
        }

        for (const Row of ExistingRows) {
            Row.Destroy();
        }
    }
}