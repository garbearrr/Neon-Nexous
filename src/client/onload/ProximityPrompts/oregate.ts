import { Players, ProximityPromptService } from "@rbxts/services";
import { PlacedItems } from "client/modules/Placement/PlacedItems";

ProximityPromptService.PromptTriggered.Connect((Prompt, Player) => {
    if (Player.UserId !== Players.LocalPlayer.UserId) return;

    const PlacedItem = PlacedItems.GetItem(tonumber(Prompt.Parent?.Name) ?? -1);
    if (PlacedItem === undefined) return;

    const Gate = Prompt.Parent as Workspace["Items"]["Upgraders"]["40001"];
    
    Gate.Gate.CanCollide = !Gate.Gate.CanCollide;
    Gate.Gate.Transparency = Gate.Gate.CanCollide ? 0.25 : 0.75;
});

