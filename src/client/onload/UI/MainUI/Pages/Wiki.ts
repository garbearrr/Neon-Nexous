import { Players } from "@rbxts/services";
import { BGScroll } from "../BGScroll";
import { MainUIPage } from "../MainUIPage";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const WikiFrame = MainUI.MainFrame.Content.ScrollingFrame.Wiki;

class WikiPage extends MainUIPage {
    public constructor(Frame: typeof WikiFrame) {
        super(Frame);
    }

    public OnOpen() {
        //this.Page.Visible = true;
    }

    public OnClose() {
        //this.Page.Visible = false;
    }
}


BGScroll.AddFrame(new WikiPage(WikiFrame));