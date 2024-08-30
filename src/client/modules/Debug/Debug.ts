import { Players } from "@rbxts/services";
import { Input } from "../Input/Input";
import { Camera } from "../Camera/Camera";
import { ExtractMethods } from "../../../../types/util";

// NOTE: This isn't designed to be destructed and reinstantiated.

export class Debug {

    private static _instance: Debug;

    private ClientDebug = Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild("ClientDebug") as StarterGui["ClientDebug"];

    public static Enable(): void {
        if (Debug._instance !== undefined) return;
        new Debug();
    }

    private constructor() {
        print("❗❗❗ CLIENT DEBUG ENABLED ❗❗❗");
        this.CamDebugInit();
        this.InputDebugInit();

        const DGUI = this.ClientDebug;

        DGUI.Enabled = true;
        DGUI.Main.Visible = true;

        const DebugViews = DGUI.GetChildren().filter(c => c.Name !== "Main") as Frame[];
        const DebugEntry = DGUI.Main.Entry;
        for (const View of DebugViews) {
            const Clone = DebugEntry.Clone();

            Clone.Visible = true;
            Clone.Text = View.Name;
            Clone.Parent = DGUI.Main;

            Clone.Activated.Connect(() => View.Visible = true);
        }
    }

    private CamDebugInit(): void {
        const CGUI = this.ClientDebug.CamModule;

        const Sliders = CGUI.List.GetChildren().filter(c => c.HasTag("Slider")) as (typeof CGUI.List.SetCameraSpeed)[];

        const AttemptCamMethod = (method: keyof ExtractMethods<Camera>, arg: any) => {
            if (!Camera.IsInstanced()) return;

            try {
                return Camera.Instance()[method](arg as never, undefined as never);
            } catch (e) {
                this.DebugError("Invalid camera method name: " + method);
                return;
            }
        }

        const SlideGetMethods: string[] = [];

        for (const Slider of Sliders) {
            const Drag = Slider.Slider.Bar.Dragger;
            const Entry = Slider.Slider.Value;

            Drag.UIDragDetector.DragContinue.Connect((_InputPos) => {
                const Val = math.clamp(Drag.Position.X.Scale, 0, 1);
                Entry.Text = tostring(Val).sub(1, 5);

                Drag.Position = new UDim2(Val, 0, 0.5, 0);

                AttemptCamMethod(Slider.Name as keyof ExtractMethods<Camera>, Val);
            });

            Entry.FocusLost.Connect(() => {
                const Val = tonumber(Entry.Text);
                if (Val === undefined) {
                    Entry.Text = "0";
                    return;
                }

                const Clamped = math.clamp(Val, 0, 1);
                Entry.Text = tostring(Clamped).sub(1, 5);

                Drag.Position = new UDim2(Clamped, 0, 0.5, 0);

                AttemptCamMethod(Slider.Name as keyof ExtractMethods<Camera>, Clamped);
            });

            SlideGetMethods.push(Slider.Name.gsub("Set", "Get")[0]);
        }

        CGUI.List["Control Settings"].refresh.Activated.Connect((_) => {
            if (!Camera.IsInstanced()) return;

            for (const GetMethod of SlideGetMethods) {
                const Val = AttemptCamMethod(GetMethod as keyof ExtractMethods<Camera>, undefined);
                if (Val === undefined) continue;

                const Slider = Sliders.find(s => s.Name.gsub("Set", "Get")[0] === GetMethod);
                if (!Slider) continue;

                Slider.Slider.Value.Text = tostring(Val).sub(1, 5);
                Slider.Slider.Bar.Dragger.Position = new UDim2(Val as number, 0, 0.5, 0);
            }
        });

        const Checkboxes = CGUI.List.GetChildren().filter(c => c.HasTag("CamDebugToggle")) as (typeof CGUI.List.InvertCamLeftRight)[];

        for (const Checkbox of Checkboxes) {
            Checkbox.Checkbox.Activated.Connect(() => {
                Checkbox.Checkbox.Text = Checkbox.Checkbox.Text === "❌" ? "✅" : "❌";
                const Checked = Checkbox.Checkbox.Text === "✅";

                AttemptCamMethod(Checkbox.Name as keyof ExtractMethods<Camera>, Checked);
            });
        }

        CGUI.List.FlipMouse.Checkbox.Activated.Connect(() => {
            const Checked = CGUI.List.FlipMouse.Checkbox.Text === "✅";
            const Button = Checked ? Enum.UserInputType.MouseButton1 : Enum.UserInputType.MouseButton2;
            CGUI.List.FlipMouse.Checkbox.Text = Checked ? "❌" : "✅";

            Camera.Instance().FlipMouseButtons(Button);
        });

        const MultiSelect = CGUI.List.GetChildren().filter(c => c.HasTag("CamDebugMulti")) as (typeof CGUI.List.LockLookDirections)[];

        for (const Multi of MultiSelect) {
            const Buttons = Multi.GetChildren().filter(c => c.IsA("TextButton")) as TextButton[];

            for (const Button of Buttons) {
                Button.Activated.Connect(() => {
                    const Active = Button.GetAttribute("On") as boolean;
                    const Prefix = Active ? "Un" : "";
                    const Color = Active ? Color3.fromRGB(26, 26, 26) : Color3.fromRGB(0, 86, 0);

                    Button.SetAttribute("On", !Active);
                    Button.BackgroundColor3 = Color;
                    
                    AttemptCamMethod(`${Prefix}${Multi.Name}` as keyof ExtractMethods<Camera>, tonumber(Button.Name));
                });
            }
        }

        const ShowContainer = CGUI.List.ShowContainer;
        ShowContainer.Checkbox.Activated.Connect(() => {
            const Checked = ShowContainer.Checkbox.Text === "✅";
            ShowContainer.Checkbox.Text = Checked ? "❌" : "✅";

            const Container = Camera.Instance().GetCameraContainer();
            if (!Container) return;

            Container.Transparency = Checked ? 1 : 0.65;
            Container.Color = Color3.fromRGB(255, 0, 0);
            Container.Material = Enum.Material.Neon;
        });
    }

    private DebugError(message: string, prefix=true): void {
        if (prefix) {
            message = `❗❗❗ CLIENT DEBUG ERROR: ${message}`;
        }

        print(message);
    }

    private InputDebugInit(): void {
        const IGUI = this.ClientDebug.InputModule;
        const Entry = IGUI.List.Entry;

        const In = Input.Instance();

        In.Events.OnBind.Connect(BindConfig => {
            const Clone = Entry.Clone();

            Clone.Visible = true;
            Clone.Parent = IGUI.List;
            Clone.ID.Text = BindConfig.GetId();
            Clone.Key.Text = BindConfig.GetKey().Name;

            Clone.Flags.Text += BindConfig.AmIIgnoringGameProccessedEvent() ? "IG " : "";
            Clone.Flags.Text += BindConfig.IsOnce() ? "Once " : "";

            Clone.Unbind.Activated.Connect(() => BindConfig.Disconnect());
        });

        const GetEntry = (id: string, key: string) => {
            const _Entries = IGUI.List.GetChildren().filter(c => c.ClassName === "Frame");
            const Entries = _Entries as (typeof IGUI.List.Entry)[];

            for (const Entry of Entries) {
                if (Entry.ID.Text !== id) continue;
                if (Entry.Key.Text !== key) continue;

                return Entry;
            }
        }

        In.Events.OnBindRemove.Connect(BindConfig => {
            const ID = BindConfig.GetId();
            const Key = BindConfig.GetKey().Name;

            GetEntry(ID, Key)?.Destroy();
        });

        const AddFlag = (id: string, key: string, flag: string) => {
            const Entry = GetEntry(id, key);
            if (!Entry) return;

            const Flags = Entry.Flags;
            if (!Flags.Text.find(flag)[0]) {
                Flags.Text += `${flag} `;
            }
        }

        const RemoveFlag = (id: string, key: string, flag: string) => {
            const Entry = GetEntry(id, key);
            if (!Entry) return;

            const Flags = Entry.Flags;
            Flags.Text = Flags.Text.gsub(`${flag} `, "")[0];
        } 

        In.Events.OnConfigUpdate.Connect(({Config, Flag, Added}) => {
            const ID = Config.GetId();
            const Key = Config.GetKey().Name;

            if (Added) {
                return AddFlag(ID, Key, Flag);
            }

            return RemoveFlag(ID, Key, Flag)
        });
    }
}