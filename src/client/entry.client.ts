import { Players, ReplicatedFirst } from "@rbxts/services";

const ClientRemote = ReplicatedFirst.WaitForChild("BeginClient") as BindableEvent;
const ClientRes = ReplicatedFirst.WaitForChild("ClientResponse") as BindableEvent;

const StartClient = () => {
    _G.Log = (Message: string, Prefix: string = "") => {
        print(`[LOG] |${Prefix}| ${Message}`);
    }

    const _Wait = Players.LocalPlayer.Character || Players.LocalPlayer.CharacterAdded.Wait();

    _G.Log("Client started!", "CLIENT");

    import("./onload/Grid/index");
    import("./onload/Plot/index");
    import("./onload/Inventory/index");
    import("./onload/Money/index");
    ClientRes.Fire();
}


ClientRemote.Event.Connect(() => StartClient());