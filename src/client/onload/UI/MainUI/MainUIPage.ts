import { Players } from "@rbxts/services";


const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

declare type TemplatePage = Frame;

export abstract class MainUIPage {
    public readonly Page: TemplatePage;

    protected constructor(Page: TemplatePage) {
        this.Page = Page;
    }

    public abstract OnOpen(): void;

    public abstract OnClose(): void;
}