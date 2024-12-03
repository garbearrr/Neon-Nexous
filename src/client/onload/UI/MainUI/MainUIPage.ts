import { Players } from "@rbxts/services";
import BuildActionButton from "../ActionButtons/BuildActionButton";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const ActionButtonFrame = MainUI.WaitForChild("Left").WaitForChild("Actions") as StarterGui["MainUI"]["Left"]["Actions"];

const IgnoreBGColor = ["1_Build"]

declare type TemplatePage = Frame | CanvasGroup;

export abstract class MainUIPage {
    public readonly Page: TemplatePage;

    protected constructor(Page: TemplatePage) {
        this.Page = Page;
    }

    public abstract OnOpen(): void;

    public abstract OnClose(): void;

    public OnFrameChange(): void {
        for (const Child of ActionButtonFrame.GetChildren() as GuiObject[]) {
            if (!Child.IsA("TextButton")) continue;
            if (IgnoreBGColor.includes(Child.Name)) continue;
            if (Child.BackgroundColor3 !== BuildActionButton.ActiveColor) continue;
            Child.BackgroundColor3 = BuildActionButton.OGBGColor;
        }
    }
}