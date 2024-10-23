import { Players } from "@rbxts/services";


export namespace ItemActions {
    const Player = Players.LocalPlayer;
    const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
    const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];
    const ActionUI = MainUI.WaitForChild("Bottom")?.WaitForChild("ItemActionInfo") as StarterGui["MainUI"]["Bottom"]["ItemActionInfo"];

    let ActionUIOpen = false;
    let UndoCb: Callback | undefined;

    export const HideUI = () => {
        ActionUI.Visible = false
        ActionUIOpen = false;
        UndoCb = undefined;
    }

    export const IsActionUIOpen = () => ActionUIOpen;

    export const ShowBasicUI = (ItemName: string) => {
        ActionUI.Visible = true;
        ActionUI.Info.ItemName.Text = ItemName;
        ActionUI.Info.Actions.Visible = false;
        ActionUI.Info.UIListLayout.VerticalFlex = Enum.UIFlexAlignment.None;
    }

    export const ShowActionsUI = (ItemName: string, UndoCallback?: Callback) => {
        if (UndoCb !== undefined) UndoCb();
        
        ActionUI.Visible = true;
        ActionUI.Info.ItemName.Text = ItemName;
        ActionUI.Info.Actions.Visible = true;
        ActionUI.Info.UIListLayout.VerticalFlex = Enum.UIFlexAlignment.Fill;
        ActionUIOpen = true;
        UndoCb = UndoCallback;
    }
}