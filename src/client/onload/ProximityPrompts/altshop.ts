import { Players, ProximityPromptService } from "@rbxts/services";
import { AltShop } from "client/modules/AltShop/AltShop";

ProximityPromptService.PromptTriggered.Connect((Prompt, Player) => {
    if (Player.UserId !== Players.LocalPlayer.UserId) return;
    if (Prompt.Parent?.Name !== "AltShop") return;

    AltShop.RollAltShop();
});

ProximityPromptService.PromptShown.Connect((Prompt, Player) => {
    if (Prompt.Parent?.Name !== "AltShop") return;

    AltShop.SetAltObjectText(`Crystal Uplink - ${AltShop.GetAltShopPrice().ToNumber()} Crystals`);
});