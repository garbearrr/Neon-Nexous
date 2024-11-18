import { Players, Workspace } from "@rbxts/services";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";

// TODO: Assign the player a free plot randomly on the server.
// TODO: Since we are focused on the client side, we will just assign a random plot.

export namespace Plot {
    export let AnchorFolder: Readonly<Workspace["Plots"]["1"]["Anchors"]>;
    export let CameraContainer: Readonly<Part>;
    export let LightningBeam: Beam;
    export let LightningStrike: Part & { LightningPart: ParticleEmitter };
    export let OreFolder: Readonly<Folder>;
    export let PlacedFolder: Readonly<Folder>;
    export let PlotItem: Readonly<Part>;
    export let TempFolder: Readonly<Folder>;

    const AssignRandomPlot = () => {
        const Open = Workspace.Plots.GetChildren();
        const Random = math.random(1, Open.size());
        const Plot = Workspace.Plots.FindFirstChild(tostring(Random)) as Workspace["Plots"]["1"];

        Plot.WaitForChild("BuildModulePlot");

        AnchorFolder = Plot.Anchors;
        CameraContainer = Plot.BuildModulePlot.CameraContainer;
        LightningBeam = Plot.BuildModulePlot.LightningBeam;
        LightningStrike = Plot.BuildModulePlot.LightningStrike;
        OreFolder = Plot.Ore;
        PlacedFolder = Plot.PlacedItems;
        PlotItem = Plot.BuildModulePlot;
        TempFolder = Plot.Temp;

        _G.Log(`Assigned plot ${Random}`, "Plot");
    }

    export const TeleportPlayerOverPlot = () => {
        const Character = Players.LocalPlayer.Character;
        Character?.MoveTo(PlotItem.Position.add(new Vector3(0, 10, 0)));
        _G.Log("Teleported player over plot", "Plot");
    }

    const ShakeCameraWhileLightningStrikes = (duration: number, intensity: number) => {
        const Camera = Workspace.CurrentCamera!;
        const originalCFrame = Camera.CFrame;
        const endTime = tick() + duration;

        // Shake the camera until the duration ends
        while (tick() < endTime) {
            // Random offset for shake effect
            const offsetX = (math.random() - 0.5) * intensity;
            const offsetY = (math.random() - 0.5) * intensity;
            const offsetZ = (math.random() - 0.5) * intensity;

            // Apply the random offset to the camera CFrame
            Camera.CFrame = originalCFrame.mul(new CFrame(offsetX, offsetY, offsetZ));

            // Wait a short duration before the next shake
            wait(0.05);
        }

        // Reset the camera CFrame back to its original position
        Camera.CFrame = originalCFrame;
    };

    export const QuickEffectTeleport = () => {
        const Character = Players.LocalPlayer.Character;
        if (!Character) {
            warn("Character not found!");
            return;
        }

        const PrimaryPart = Character.PrimaryPart;
        if (!PrimaryPart) {
            warn("Character does not have a PrimaryPart!");
            return;
        }

        Plot.LightningBeam.Enabled = true;
        Plot.LightningStrike.LightningPart.Enabled = true;

        // Move the character to the teleport target
        Character?.MoveTo(PlotItem.Position.add(new Vector3(0, Character.PrimaryPart!.Size.Y, 0)));

        // Shake the camera
        ShakeCameraWhileLightningStrikes(0.5, 0.5);

        Scheduling.SetTimeout(() => {
            Plot.LightningBeam.Enabled = false;
            Plot.LightningStrike.LightningPart.Enabled = false;
        }, 1);

        _G.Log("Teleported player over plot with effects", "Plot");
    }

    export const TeleportPlayerWithEffects = (onComplete?: () => void) => {
        const Character = Players.LocalPlayer.Character;
        if (!Character) {
            warn("Character not found!");
            return;
        }

        const PrimaryPart = Character.PrimaryPart;
        if (!PrimaryPart) {
            warn("Character does not have a PrimaryPart!");
            return;
        }

        const TeleportTarget = PlotItem.Position.add(new Vector3(0, PrimaryPart.Size.Y, 0));
        const Camera = Workspace.CurrentCamera!;

        // Freeze the character
        const Humanoid = Character.FindFirstChild("Humanoid") as Humanoid;
        if (!Humanoid) {
            warn("Humanoid not found in character!");
            return;
        }

        Humanoid.WalkSpeed = 0;
        Humanoid.JumpPower = 0;

        // Store the original camera type
        const OGCamType = Camera.CameraType;

        // Make the camera scriptable and set its new CFrame
        Camera.CameraType = Enum.CameraType.Scriptable;
        const newCameraCFrame = CFrame.lookAt(TeleportTarget.add(new Vector3(0, 15, -15)), TeleportTarget);
        Camera.CFrame = newCameraCFrame;

        wait(1);

        Plot.LightningBeam.Enabled = true;
        Plot.LightningStrike.LightningPart.Enabled = true;

        // Move the character to the teleport target
        Character?.MoveTo(PlotItem.Position.add(new Vector3(0, Character.PrimaryPart!.Size.Y, 0)));

        // Shake the camera
        ShakeCameraWhileLightningStrikes(0.5, 0.5);

        Scheduling.SetTimeout(() => {
            Plot.LightningBeam.Enabled = false;
            Plot.LightningStrike.LightningPart.Enabled = false;

            // Reset the camera type back to original without changing its CFrame
            Camera.CameraType = OGCamType;

            // Restore character controls (defaults)
            Humanoid.WalkSpeed = 16;
            Humanoid.JumpPower = 50;

            wait(0.5);
            if (onComplete !== undefined) {
                onComplete();
            }
        }, 1);

        _G.Log("Teleported player over plot with effects", "Plot");
    }

    AssignRandomPlot();
}
