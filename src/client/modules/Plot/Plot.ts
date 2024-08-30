import { Players, Workspace } from "@rbxts/services";

// TODO: Assign the player a free plot randomly on the server.
// TODO: Since we are focused on the client side, we will just assing a random plot.

export namespace Plot {
    export let CameraContainer: Readonly<Part>;
    export let OreFolder: Readonly<Folder>;
    export let PlacedFolder: Readonly<Folder>;
    export let PlotItem: Readonly<Part>;
    export let TempFolder: Readonly<Folder>;

    const AssignRandomPlot = () => {
        const Open = Workspace.Plots.GetChildren();
        const Random = math.random(1, Open.size());
        const Plot = Workspace.Plots.FindFirstChild(tostring(Random)) as Workspace["Plots"]["1"];

        CameraContainer = Plot.BuildModulePlot.CameraContainer;
        OreFolder = Plot.Ore;
        PlacedFolder = Plot.PlacedItems;
        PlotItem = Plot.BuildModulePlot;
        TempFolder = Plot.Temp;
    }

    const TeleportPlayerOverPlot = () => {
        const Character = Players.LocalPlayer.Character;
        Character?.MoveTo(PlotItem.Position.add(new Vector3(0, 10, 0)));
    }

    AssignRandomPlot();
    TeleportPlayerOverPlot();
}