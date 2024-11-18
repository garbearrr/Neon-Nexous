import { Players, Workspace } from "@rbxts/services";
import { Plot } from "client/modules/Plot/Plot";

// After plot teleportation, import the rest of the client modules
Plot.TeleportPlayerWithEffects(() => import("../index"));

// If player falls off the environment, teleport them back
(Workspace.WaitForChild("FallPart") as Part).Touched.Connect(() => {
    Plot.QuickEffectTeleport();
});

// If a player somehow dies or resets, teleport them back
Players.LocalPlayer.CharacterAdded.Connect(() => {
    Plot.QuickEffectTeleport();
});