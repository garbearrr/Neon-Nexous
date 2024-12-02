//import { CollectionService, Players } from "@rbxts/services";
//import { Collection } from "shared/modules/Collection/Collection";
//import { Scheduling } from "shared/modules/Scheduling/Scheduling";
//import { Util } from "shared/modules/Util/Util";
//import { Template3DPage, ThreeDeePage } from "../ThreeDeePage";

/*
const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const ThreeDUI = PlayerGui.WaitForChild("ThreeDUI") as StarterGui["ThreeDUI"];

export abstract class BaseItemMenuGrid extends ThreeDeePage {
    protected readonly Menu: Template3DPage;

    private SizeChangeConnection: RBXScriptConnection | undefined;

    private readonly OGCellSizeData: UDim2;
    private readonly OGCellSize: number;
    private readonly ContentFrame: Template3DPage["3_Content"]["1_ItemFrame"];
    private readonly TemplateRow: Template3DPage["3_Content"]["1_ItemFrame"]["TemplateRow"];

    protected ActivationTI = new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
    protected CellsPerRow = 5;
    protected CellTag = "ShopCell";
    protected RowTag = "ShopRow";

    protected constructor(Frame: Template3DPage) {
        super(Frame);
        this.Menu = Frame;

        Frame.Visible = true;
        //this.SetNotVisPosition();

        this.ContentFrame = Frame["3_Content"]["1_ItemFrame"];
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
        
        this.SizeChangeConnection = ThreeDUI.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
            if (!this.Menu.Visible) return;
            DebouncedPopulate();
        });
    }

    private GenerateCells() {
        const FoundItems = this.ItemSource();

        const NewCells = [];
        for (const {ItemId, Name, Item} of FoundItems.Values()) {
            const CellClone = this.TemplateRow.TemplateItem.Clone();
            CellClone.Parent = this.ContentFrame;
            CollectionService.AddTag(CellClone, this.CellTag);

            CellClone.Visible = true;
            NewCells.push(CellClone);

            this.OnCellAdded([CellClone, CellClone.ImageButton], ItemId, Name, Item);
        }

        return NewCells;
    }

    protected abstract ItemSource(): Collection<string, {ItemId: string, Name: string, Item: Part}>;

    protected OnCellAdded(Buttons: GuiButton[], ItemId: string, Name: string, Item: Part): void {

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
                }
            }
        }

        for (const Row of ExistingRows) {
            Row.Destroy();
        }
    }
}*/