import { Players } from "@rbxts/services";
import { BGScroll } from "../BGScroll";
import { MainUIPage } from "../MainUIPage";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const SettingsFrame = MainUI.MainFrame.Content.ScrollingFrame.Settings;

class SettingsPage extends MainUIPage {
    public constructor(Frame: typeof SettingsFrame) {
        super(Frame);
    }

    public OnOpen() {
        //this.Page.Visible = true;
    }

    public OnClose() {
        //this.Page.Visible = false;
    }
}


BGScroll.AddFrame(new SettingsPage(SettingsFrame));