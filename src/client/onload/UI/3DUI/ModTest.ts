import { Players, Workspace } from "@rbxts/services";
import { Ui3DManager } from "client/modules/Ui3D/3DManager";
import { Ui3DPage } from "client/modules/Ui3D/3DPage";


const GuiPart = Workspace.WaitForChild("GuiPart") as Workspace["GuiPart"];

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const PagesFolder = PlayerGui.WaitForChild("3DPages") as StarterGui["3DPages"];

// Create 5 frames of full size and add them to the Pages folder. Make the background a differnet color for each
const Pages = [];

for (let i = 0; i < 5; i++) {
    const Page = new Instance("Frame") as Frame;
    Page.Size = new UDim2(1, 0, 1, 0);
    Page.BackgroundColor3 = new Color3(i / 5, i / 5, i / 5);
    Page.Parent = PagesFolder;
    Page.Visible = false;
    Pages.push(new Ui3DPage(Page, `Page${i}`));
}

for (const Page of Pages) {
    Ui3DManager.AddPage(Page);
}

Ui3DManager.Activate();