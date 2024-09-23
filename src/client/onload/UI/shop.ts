import { CollectionService, Players, TweenService, Workspace } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";
import { Util } from "shared/modules/Util/Util";

const OFF_SCREEN_POS = new UDim2(1.5, 0, 1, 0);
const TI_TIMEOUT = 0.3;
const ACTIVATE_TI = new TweenInfo(TI_TIMEOUT, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
const ACTIVE_COLOR = Color3.fromHex("#585858");

const CELLS_PER_ROW = 4;
const CELL_TAG = "ShopCell";
const ROW_TAG = "ShopRow";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;

const ShopButton = PlayerGui.MainUI.Top["2_Actions"]["3_Shop"];
const ShopFrame = PlayerGui.MainUI.Bottom.Shop;

const OriginalFramePos = ShopFrame.Position;
const OriginalColor = ShopButton.BackgroundColor3;

// Initialization
ShopFrame.Visible = false;
ShopFrame.Position = OFF_SCREEN_POS;

let toggleTimeOut = false;
const ToggleShopFrame = () => {
    if (toggleTimeOut) return;
    toggleTimeOut = true;

    const Pos = ShopFrame.Visible ? OFF_SCREEN_POS : OriginalFramePos;
    const Color = ShopFrame.Visible ? OriginalColor : ACTIVE_COLOR;

    ShopFrame.Visible = !ShopFrame.Visible;
    ShopButton.BackgroundColor3 = Color;

    const Tween = TweenService.Create(ShopFrame, ACTIVATE_TI, { Position: Pos });
    Tween.Completed.Connect(() => toggleTimeOut = false);
    Tween.Play();
}

ShopFrame["1_Bar"].Bar["2_Close"].Activated.Connect(() => ToggleShopFrame());
ShopButton.Activated.Connect(() => ToggleShopFrame());
ShopButton.Shop.Activated.Connect(() => ToggleShopFrame());

const ShopContentFrame = ShopFrame["3_Content"]["ScrollingFrame"];
const TemplateRow = ShopContentFrame.TemplateRow;
TemplateRow.Visible = false;
TemplateRow.TemplateItem.Visible = false;
TemplateRow.TemplateItem.ViewportFrame.Model["10000"].Destroy();

const OriginalCellSizeData = ShopContentFrame.UIGridLayout.CellSize;
const OriginalCellSize = OriginalCellSizeData.Y.Offset;

const GenerateCells = () => {
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

    const NewCells = [];
    for (const {ItemId, Name, Item} of FoundItems.Values()) {
        const CellClone = TemplateRow.TemplateItem.Clone();
        CellClone.Parent = ShopContentFrame;
        CollectionService.AddTag(CellClone, CELL_TAG);

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

const PopulateShop = () => {
    let ExistingCells = ShopContentFrame.GetDescendants().filter(c => CollectionService.HasTag(c, CELL_TAG)) as (typeof TemplateRow.TemplateItem)[];
    if (ExistingCells.size() <= 0) {
        ExistingCells = GenerateCells();
    }

    const TemplateRowWidth = TemplateRow.AbsoluteSize.X;
    const CellsInRow = TemplateRowWidth / OriginalCellSize;
    const NewRatio = CellsInRow / CELLS_PER_ROW;
    const NewCellSize = OriginalCellSize * NewRatio;
    ShopContentFrame.UIGridLayout.CellSize = new UDim2(OriginalCellSizeData.X, new UDim(0, NewCellSize));

    const Rows = math.ceil(ExistingCells.size() / CELLS_PER_ROW);
    const Chunked = Util.SplitArray<typeof TemplateRow.TemplateItem>(ExistingCells, CELLS_PER_ROW);
    const ExistingRows = ShopContentFrame.GetChildren().filter(c => CollectionService.HasTag(c, ROW_TAG)) as (typeof TemplateRow)[];

    for (let i = 0; i < Rows; i++) {
        const Row = Chunked[i];
        const RowClone = TemplateRow.Clone();
        RowClone.Name = `Row_${i}`;
        RowClone.Parent = ShopContentFrame;
        CollectionService.AddTag(RowClone, ROW_TAG);

        RowClone.Visible = true;
        RowClone.Size = new UDim2(1, 0, 0, NewCellSize);

        Row.forEach((Cell, Index) => {
            Cell.Parent = RowClone;
            Cell.Position = new UDim2(0, Index * NewCellSize, 0, 0);
        });

        if (i === Rows - 1 && Row.size() < CELLS_PER_ROW) {
            for (let j = Row.size(); j < CELLS_PER_ROW; j++) {
                const CellClone = TemplateRow.TemplateItem.Clone();
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

PopulateShop();

// Debounce the PopulateShop function
const DebouncedPopulateShop = Scheduling.Debounce(PopulateShop, 0.2); // Debounce with a 0.2s delay

// Connect to window resize (AbsoluteSize changes) and trigger the debounced function
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
MainUI.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
    if (!ShopFrame.Visible) return;
    DebouncedPopulateShop();
});