import { BigNumber } from "shared/modules/BigNumber/BigNumber";
import { OreManager } from "./OreManager";
import { Money } from "../Money/Money";
import { CollectionService, Players, RunService, TweenService, Workspace } from "@rbxts/services";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";
import { UI as CUI } from "client/onload/UI/currency";
import { UI as LUI } from "client/onload/UI/level";
import { InstatiateParticleEmitter } from "shared/modules/ParticleEmitter/ParticleEmitter";
import { Level } from "../Level/Level";

let oid = 0;

const OreStuckTests = 3;
const OreStuckInterval = 2; // Seconds
const ValidStuckTags = ["Conveyor", "Upgrader"];

export class Ore implements IOre {
    public readonly Dropper: DropperData;
    public readonly Ore: TemplateOre;
    public readonly OreId = oid++;

    private Cleanup: () => void = () => {};
    private readonly MoneyUI = CUI.Currency.GetMoneyText();
    private readonly LevelUI = LUI.Level.GetLevelUI();
    private readonly RaycastParams = new RaycastParams();
    private Stucks = 0;
    private Upgrades = 0;
    private Value: BigNumber;

    public constructor(Dropper: DropperData, Ore: TemplateOre) {
        this.Dropper = Dropper;
        this.Ore = Ore;
        this.Value = new BigNumber(Dropper.Stats.OreValue.Value);

        this.RaycastParams.FilterType = Enum.RaycastFilterType.Exclude;
        this.RaycastParams.FilterDescendantsInstances = [this.Ore];

        //this.StartOreRayCheck();
    }

    public AddValue(Value: BigNumber): void {
        this.Value = this.Value.Add(Value);
        this.Stucks = 0;
        _G.Log(`Added ${Value} to ${this.OreId}`, "Ore");
    }

    public AddUpgrade(): void {
        this.Upgrades++;
        _G.Log(`Added upgrade to ${this.OreId}`, "Ore");
    }

    public GetUpgradeCount(): number {
        return this.Upgrades;
    }

    public GetValue(): BigNumber {
        return this.Value;
    }

    public Process(): void {
        Money.AddMoney(this.Value, true, false);
        Level.AddXP(this.Value);
        Level.UpdateGraphic();

        this.SparkleEffect(this.Ore.Position.add(new Vector3(0, this.Ore.Size.Y, 0)), this.MoneyUI);
        //this.SparkleEffect(this.Ore.Position.add(new Vector3(0, this.Ore.Size.Y, 0)), this.LevelUI, true);

        _G.Log(`Processed ${this.Value} from ${this.OreId}`, "Ore");
        this.Destroy();
    }

    public SetValue(Value: BigNumber): void {
        this.Value = Value;
        this.Stucks = 0;
        _G.Log(`Set value of ${this.OreId} to ${Value}`, "Ore");
    }

    private SparkleEffect(StartPosition: Vector3, TargetUI: GuiObject, xp = false): void {
        // Get the local player and their PlayerGui
        const player = Players.LocalPlayer;
        if (!player) return;
    
        const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
        let sparkleGUI = playerGui.FindFirstChild("SparkleGUI") as ScreenGui | undefined;
    
        // If the SparkleGUI doesn't exist, create it
        if (!sparkleGUI) {
            sparkleGUI = new Instance("ScreenGui");
            sparkleGUI.Name = "SparkleGUI";
            sparkleGUI.ResetOnSpawn = false;
            sparkleGUI.Parent = playerGui;
        }
    
        // Convert the StartPosition's world position to screen position
        const camera = Workspace.CurrentCamera;
        if (!camera) return;
    
        const [screenPoint, onScreen] = camera.WorldToViewportPoint(StartPosition);
        const screenPosition = new Vector2(screenPoint.X, screenPoint.Y);
    
        // Define the target position in screen space
        const targetPosition = new Vector2(
            TargetUI.AbsolutePosition.X + TargetUI.AbsoluteSize.X / 2,
            TargetUI.AbsolutePosition.Y + TargetUI.AbsoluteSize.Y / 2
        );
    
        // Calculate distance between start and target
        const distance = screenPosition.sub(targetPosition).Magnitude;
    
        // Define minimum and maximum sizes
        const minSize = 20;
        const maxSize = 50;
        const maxDistance = 500; // Adjust as needed
    
        const sizeScale = math.clamp(distance / maxDistance, 0, 1);
        const initialSize = minSize + (sizeScale * (maxSize - minSize));
    
        // Define a control point for the Bezier curve to create an arc
        const midpoint = screenPosition.add(targetPosition).div(2);
        const arcHeight = -math.random(50, 150); // Negative to arc upwards; adjust range as needed
        const horizontalOffset = math.random(-100, 100); // Randomly bend left or right
        const controlPoint = midpoint.add(new Vector2(horizontalOffset, arcHeight));
    
        // Create a UI component to attach the ParticleEmitter
        const hookFrame = new Instance("Frame");
        hookFrame.Size = new UDim2(0, 0, 0, 0); // Invisible frame
        hookFrame.Position = UDim2.fromOffset(screenPosition.X, screenPosition.Y);
        hookFrame.BackgroundTransparency = 1;
        hookFrame.Parent = sparkleGUI;
    
        // Create the particle element (e.g., an ImageLabel)
        const particleElement = new Instance("ImageLabel");
        particleElement.Size = new UDim2(0, initialSize, 0, initialSize); // Use initialSize
        particleElement.BackgroundTransparency = 1;
        particleElement.Image = "http://www.roblox.com/asset/?id=298984512"; // Sparkle texture
        particleElement.ImageTransparency = 0.5;
        particleElement.AnchorPoint = new Vector2(0.5, 0.5);
        particleElement.Parent = hookFrame;
    
        // Instantiate the ParticleEmitter
        const emitter = InstatiateParticleEmitter(hookFrame, particleElement);
        emitter.rate = 10; // Emit 5 particles per second
    
        // Customize the onSpawn and onUpdate methods
        emitter.onSpawn = (particle) => {
            // Start at the current position of the hookFrame in the screen GUI
            const absolutePosition = hookFrame.AbsolutePosition;
            particle.position = new Vector2(absolutePosition.X, absolutePosition.Y);
            particle.element.Position = UDim2.fromOffset(particle.position.X, particle.position.Y);
            particle.element.Parent = sparkleGUI; // Change parent to sparkleGUI so it doesn't move with hookFrame
            particle.velocity = new Vector2(0, 0); // Particles stay in place
            particle.element.ImageTransparency = 0.5;
            particle.element.Size = UDim2.fromOffset(20, 20); // Start small
        };
    
        emitter.onUpdate = (particle, deltaTime) => {
            // Fade out particles over time
            particle.element.ImageTransparency = math.clamp(particle.element.ImageTransparency + deltaTime * 1, 0, 1);
    
            // Mark particle as dead if fully transparent
            if (particle.element.ImageTransparency >= 1) {
                particle.isDead = true;
                particle.element.Destroy();
            }
        };
    
        // Set up movement along the Bezier curve
        // Odd ass number because it falling directly in line with common drop rates gets weird
        const totalDuration = 0.89645; // Duration in seconds
        let elapsedTime = 0;
    
        const connection = RunService.RenderStepped.Connect((deltaTime) => {
            elapsedTime += deltaTime;
            let t = math.clamp(elapsedTime / totalDuration, 0, 1);
    
            // Apply easing function to t to start slow and get faster
            t = t * t; // Quadratic easing in
    
            // Quadratic Bezier curve formula
            const position = screenPosition.mul((1 - t) * (1 - t))
                .add(controlPoint.mul(2 * (1 - t) * t))
                .add(targetPosition.mul(t * t));
    
            // Update the hookFrame position
            hookFrame.Position = UDim2.fromOffset(position.X, position.Y);
    
            // Optional: Rotate the particleElement to face the direction of movement
            const derivative = screenPosition.mul(-2 * (1 - t))
                .add(controlPoint.mul(2 - 4 * t))
                .add(targetPosition.mul(2 * t));
    
            const angle = math.atan2(derivative.Y, derivative.X);
            particleElement.Rotation = math.deg(angle);
    
            // Increase size over time if distance is great
            const currentSize = minSize + (initialSize - minSize) * t;
            particleElement.Size = UDim2.fromOffset(currentSize, currentSize);
    
            // If we've reached the end, disconnect and clean up
            if (t >= 1) {
                connection.Disconnect();
                hookFrame.Destroy();
            }
        });
    
        // Stop emitting after totalDuration
        delay(totalDuration, () => {
            emitter.Destroy();
            if (xp) {
                Level.UpdateGraphic();
            } else {
                Money.UpdateUI();
            }
        });
    }
    
    
    
    public Destroy(): void {
        OreManager.Remove(this.OreId);
        _G.Log(`Destroyed ${this.OreId}`, "Ore");
        this.Ore.Destroy();
        this.Cleanup?.();
    }

    private FireRayAtOre(): void {
         // Create a ray going directly downward from the ore's position
        const RayOrigin = this.Ore.Position;
        const RayDirection = new Vector3(0, -10, 0); // 10 studs down

        const RayResult = Workspace.Raycast(RayOrigin, RayDirection);

        if (RayResult !== undefined) {
            const HitPart = RayResult.Instance;

            const IsValid = ValidStuckTags.some((Tag) => {
                if (CollectionService.HasTag(HitPart, Tag)) {
                    return true;
                }
                return false;
            });

            if (IsValid) {
                this.Stucks = 0;
                return;
            }
            
            this.Stucks++;
            _G.Log(`Ore ${this.OreId} is stuck tries ${this.Stucks}`, "Ore");
            if (this.Stucks >= OreStuckTests) {
                this.Destroy();
            }
            
        } else {
            // No part was hit, meaning ore is likely off the plot
            // this.Destroy();
        }
    }

    private StartOreRayCheck(): void {
        this.Cleanup = Scheduling.SetInterval(() => {
            this.FireRayAtOre();
        }, OreStuckInterval);
    }
}

// TODO: Reevaluate ore stuck algorithm.
// TODO: Perhaps check if stuck if ore hasn't been pinged in a while and is not on a gate (add tags to gates).