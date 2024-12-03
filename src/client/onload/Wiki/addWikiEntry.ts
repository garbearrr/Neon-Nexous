import { Players } from "@rbxts/services";
import { WidgetManager } from "client/modules/UI/WidgetManager";
import { WidgetManagerWidget } from "client/modules/UI/WidgetManagerWidget";
import { WidgetPage } from "client/modules/UI/WidgetPage";
import { ParentWikiManager } from "./ui";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
const ChildFrame = MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WMFrame;

export const AddWikiEntry = (Name: string) => {
    const Page = new WidgetPage(Name, ChildFrame);
    Page.AddWidget(new WidgetManagerWidget(Name));

    ParentWikiManager.AddPage(Page, true);

    const NestedWM = new WidgetManager(
        ChildFrame.FindFirstChild(Name)?.FindFirstChild("Content") as ScrollingFrame & {
            TemplateButton: TextButton;
        }
    )
    .SetOnButtonCallback((Page) => {
        Page.UpdateAll();
        Page.GetParent().GetChildren().forEach((Child) => {
            if (Child.Name === Page.GetName()) return;
            if (Child.IsA("GuiObject")) {
                Child.Visible = false;
            }
        });
    });

    return NestedWM;
}