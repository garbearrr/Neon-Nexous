import { Players } from "@rbxts/services";
import { WidgetPage } from "client/modules/UI/WidgetPage";
import { AddWikiEntry } from "../addWikiEntry";
import { WikiWidget } from "client/modules/UI/WikiWidget";
import { Input } from "client/modules/Input/Input";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

const Entry = AddWikiEntry("Roblox Basics");

const Movement = new WidgetPage("Movement", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
Movement.AddWidget(
    new WikiWidget("Movement")
        .AddLine(`Roblox is a game that allows you to move around in a 3D environment. You can move around using the following keys:`)
        .AddLine(`- ${Input.C2SDirect("W")}: Move forward`)
        .AddLine(`- ${Input.C2SDirect("A")}: Move left`)
        .AddLine(`- ${Input.C2SDirect("S")}: Move backward`)
        .AddLine(`- ${Input.C2SDirect("D")}: Move right`)
        .AddLine(`- ${Input.C2SDirect("Space")}: Jump`)
        .AddLine(`The arrow keys can also be used to move around:`)
        .AddLine(`- ${Input.C2SDirect("Up")}: Move forward`)
        .AddLine(`- ${Input.C2SDirect("Left")}: Move Camera left`)
        .AddLine(`- ${Input.C2SDirect("Down")}: Move backward`)
        .AddLine(`- ${Input.C2SDirect("Right")}: Move Camera right`)
        .AddLine(`Many games allow users to sprint to increase their speed, including this one:`)
        .AddLine(`- ${Input.C2S(Input.Controls.KeyboardMouse.Sprint)}: Sprint`)
);
Entry.AddPage(Movement);

const Camera = new WidgetPage("Camera", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
Camera.AddWidget(
    new WikiWidget("Camera")
        .AddLine(`The camera in Roblox is used to view the game world. You can move the camera by holding ${Input.C2SDirect("MouseButton2")} and moving the mouse or by pressing:`)
        .AddLine(`- ${Input.C2SDirect("Left")}: Move Camera left`)
        .AddLine(`- ${Input.C2SDirect("Right")}: Move Camera right`)
        .AddLine(`The camera can also be zoomed in and out using the scroll wheel, using a pinch gesture on a trackpad, or by pressing:`)
        .AddLine(`- ${Input.C2SDirect("I")}: Zoom in`)
        .AddLine(`- ${Input.C2SDirect("O")}: Zoom out`)
        .AddLine(`These buttons are useful if a UI element would block zooming with the scroll wheel.`)
);
Entry.AddPage(Camera);

const Performance = new WidgetPage("Performance", MainUI.MainFrame.Content.ScrollingFrame.Wiki.Content.WikiFrame);
Performance.AddWidget(
    new WikiWidget("Performance")
        .AddLine(`Roblox is a game that can be played on a variety of devices. To ensure that the game runs smoothly, you can adjust the graphics settings. You can do this by pressing ${Input.C2SDirect("Esc")}.`)
        .AddLine(`From there, you can adjust the graphics settings to suit your device. If you are experiencing lag, try lowering the graphics settings.`)
);
Entry.AddPage(Performance);