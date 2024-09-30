import { Players, Workspace } from "@rbxts/services";
import { BaseItemMenuGrid } from "./BaseItemMenuGrid";
import { Collection } from "shared/modules/Collection/Collection";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const ShopFrame = MainUI.Bottom.Shop;

class ShopMenuGrid extends BaseItemMenuGrid {
    public constructor(Frame: typeof ShopFrame) {
        super(Frame);
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

    public SetTweenTime(time: number) {
        this.ActivationTI = new TweenInfo(time, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
    }
}

export default new ShopMenuGrid(ShopFrame);