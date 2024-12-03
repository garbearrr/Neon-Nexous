import { Players, ProximityPromptService } from "@rbxts/services";
import { AltShop } from "client/modules/AltShop/AltShop";

ProximityPromptService.PromptTriggered.Connect((Prompt, Player) => {
    if (Player.UserId !== Players.LocalPlayer.UserId) return;
    if (Prompt.Parent?.Name !== "AltShop") return;

    AltShop.RollAltShop();
});

ProximityPromptService.PromptShown.Connect((Prompt, Player) => {
    if (Prompt.Parent?.Name !== "AltShop") return;

    AltShop.SetAltObjectText(`Neon Crystal Shop - ${AltShop.GetAltShopPrice().ToNumber()} Crystals`);
});