import { CollectionService, Players, TweenService } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { Event } from "shared/modules/Event/Event";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";
import { Util } from "shared/modules/Util/Util";

declare type TemplateFrame = StarterGui["MainUI"]["Bottom"]["Shop"];

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

export abstract class BaseItemMenuGrid {
    protected readonly Menu: TemplateFrame;

    private SizeChangeConnection: RBXScriptConnection | undefined;

    private readonly OGCellSizeData: UDim2;
    private readonly OGCellSize: number;
    private readonly OGFramePos: UDim2;
    private readonly ContentFrame: TemplateFrame["3_Content"]["ScrollingFrame"];
    private readonly TemplateRow: TemplateFrame["3_Content"]["ScrollingFrame"]["TemplateRow"];

    protected ActivationTI = new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
    protected CellsPerRow = 4;
    protected CellTag = "ShopCell";
    protected RowTag = "ShopRow";

    public Events = {
       OnClose: new Event<void>()
    }

    public constructor(Frame: TemplateFrame) {
        this.Menu = Frame;
        this.OGFramePos = Frame.Position;

        Frame.Visible = false;
        this.SetNotVisPosition();

        this.ContentFrame = Frame["3_Content"]["ScrollingFrame"];
        this.TemplateRow = this.ContentFrame.TemplateRow;
        this.TemplateRow.Visible = false;
        this.TemplateRow.TemplateItem.Visible = false;
        this.TemplateRow.TemplateItem.ViewportFrame.Model["10000"].Destroy();

        this.OGCellSizeData = this.ContentFrame.UIGridLayout.CellSize;
        this.OGCellSize = this.OGCellSizeData.Y.Offset;

        Frame["1_Bar"].Bar["2_Close"].Activated.Connect(() => this.OnClose());
    }

    private ConnectSizeChange() {
        this.SizeChangeConnection?.Disconnect();

        const DebouncedPopulate = Scheduling.Debounce(() => this.PopulateMenu(), 0.2);
        
        this.SizeChangeConnection = MainUI.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
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

            const ItemClone = Item.Clone();
            ItemClone.Parent = CellClone.ViewportFrame.Model;
            CellClone.ViewportFrame.Model.PrimaryPart = ItemClone;
            CellClone.ViewportFrame.Model.PivotTo(new CFrame(0, -0.5, -14).mul(CFrame.Angles(0, math.rad(-30), 0)));
            CellClone.Name = ItemId;

            CellClone.Visible = true;
            NewCells.push(CellClone);
        }

        return NewCells;
    }

    protected abstract ItemSource(): Collection<string, {ItemId: string, Name: string, Item: Part}>;

    private OnClose() {
        this.ToggleMenu();
        this.Events.OnClose.Fire();
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
                    CellClone.BackgroundTransparency = 1;
                }
            }
        }

        for (const Row of ExistingRows) {
            Row.Destroy();
        }
    }

    protected SetNotVisPosition() {
        this.Menu.Position = new UDim2(
            this.Menu.NotVisXVal.Value,
            this.OGFramePos.X.Offset,
            this.OGFramePos.Y.Scale,
            this.OGFramePos.Y.Offset
        );
    }

    protected SetOGPosition() {
        this.Menu.Position = this.OGFramePos;
    }

    public ToggleMenu() {
        const Pos = this.Menu.Visible ? this.Menu.NotVisXVal.Value : this.OGFramePos.X.Scale;
        
        if (!this.Menu.Visible) {
            this.ConnectSizeChange();

            this.Menu.Visible = true;

            const Tween = TweenService.Create(this.Menu, this.ActivationTI, { Position: new UDim2(Pos, this.OGFramePos.X.Offset, this.Menu.Position.Y.Scale, this.Menu.Position.Y.Offset) });
            Tween.Play();
        } else {
            this.SizeChangeConnection?.Disconnect();

            const Tween = TweenService.Create(this.Menu, this.ActivationTI, { Position: new UDim2(Pos, this.OGFramePos.X.Offset, this.Menu.Position.Y.Scale, this.Menu.Position.Y.Offset) });
            Tween.Completed.Connect(() => {
                this.Menu.Visible = false;
            });

            Tween.Play();
        }
 
    }
}