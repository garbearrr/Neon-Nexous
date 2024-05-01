const Players = game.GetService("Players");
const ReplicatedFirst = game.GetService("ReplicatedFirst");
const StarterGui = game.GetService("StarterGui");
const ContentProvider = game.GetService("ContentProvider");

const LoadEvent = ReplicatedFirst.WaitForChild("LoadEvent") as BindableEvent;

const loadGame = () => {
    const clock = os.clock();

    const Player = Players.LocalPlayer;
    const PlayerGui = Player.WaitForChild("PlayerGui");

    StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false);

    const LoadingScreen = ReplicatedFirst.WaitForChild("LoadingScreen") as ReplicatedFirst["LoadingScreen"];
    LoadingScreen.IgnoreGuiInset = true;
    LoadingScreen.Parent = PlayerGui;
    LoadingScreen.Enabled = true;

    const AssetText = LoadingScreen.LoadingFrame.AssetText;

    ReplicatedFirst.RemoveDefaultLoadingScreen();

    if (!game.IsLoaded()) game.Loaded.Wait();

    const Assets = game.GetDescendants();

    Assets.forEach((Asset) => {
        ContentProvider.PreloadAsync([Asset], (cId, _status) => AssetText.Text = cId);
    });

    LoadingScreen.Destroy();

    print("Loaded in", os.clock() - clock, "seconds");
}

const assignPlot = () => {
    _G.plot = game.Workspace.WaitForChild("Plots").WaitForChild("1") as _G["plot"];
}

loadGame();
assignPlot();

LoadEvent.Fire();