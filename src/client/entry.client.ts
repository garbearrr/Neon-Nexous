import { Players } from "@rbxts/services";

_G.Log = (Message: string, Prefix: string = "") => {
    print(`[LOG] |${Prefix}| ${Message}`);
}

Players.LocalPlayer.CharacterAdded.Wait();

import("./onload/index");