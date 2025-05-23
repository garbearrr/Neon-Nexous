import { Players, UserInputService } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { Event } from "shared/modules/Event/Event";

class ControlData<T extends UniqueInputTypes> implements iControlData<T> {
    public readonly Control: T;
    public readonly Scheme: keyof ControlsType;
    public readonly Changeable: boolean = true;

    private CustomIgnoreGuiFunc: ((G: GuiObject) => boolean) | undefined;
    private DefaultIgnoreGuiFunc: (G: GuiObject) => boolean = (_) => true;

    public constructor(scheme: keyof ControlsType, control: T, changeable = true) {
        this.Scheme = scheme;
        this.Control = control;
        this.Changeable = changeable;
    }

    private Bind(id: string, key: string, func: CallbackType): iBindConfig {
        const IBindings = Input.Instance().GetBindings();
        const Bindings = IBindings.Get(key) || IBindings.Set(key, new Collection<string, iBindConfig>());

        const Config = new BindConfig(id, key, this.Control, func);
        Bindings.Set(id, Config);

        Input.Instance().Events.OnBind.Fire(Config);
        _G.Log(`Binding for ${this.Control.Name} has been added.`, "Input");
        return Config;
    }

    public DisconnectAll(): void {
        const IBindings = Input.Instance().GetBindings();
        const Key = this.Scheme + this.Control.Name;
        const Bindings = IBindings.Filter((v, k) => k.sub(1, Key.size()) === Key);
        if (Bindings.Size() === 0) return;

        Bindings.ForEach((Binding, K) => {
            Binding.ForEach(C => C.Disconnect());
            IBindings.Delete(K);
        });

        _G.Log(`All bindings for ${this.Control.Name} have been disconnected.`, "Input");
    }

    public IsDown(ignoreGui: boolean = false, Gamepad = Enum.UserInputType.Gamepad1): boolean {
        if (ignoreGui) {
            const Mouse = Players.LocalPlayer.GetMouse();
            const Gui = Players.LocalPlayer.FindFirstChild("PlayerGui") as PlayerGui;
            const Filtered = Gui.GetGuiObjectsAtPosition(Mouse.X, Mouse.Y).filter(G => this.CustomIgnoreGuiFunc ? !this.CustomIgnoreGuiFunc(G) : this.DefaultIgnoreGuiFunc(G));
            if (Filtered.size() > 0) {
                return false;
            }   
        }

        try {
            const res = UserInputService.IsKeyDown(this.Control as Enum.KeyCode)
            if (res) return res;
        } catch{}
        try {
            const res = UserInputService.IsMouseButtonPressed(this.Control as Enum.UserInputType)
            if (res) return res;
        } catch{}
        try {
            const res = UserInputService.IsGamepadButtonDown(Gamepad, this.Control as Enum.KeyCode);
            if (res) return res;
        } catch{}
        
        return false;
    }

    public OnChanged(id: string, func: CallbackType): iBindConfig {
        const Key = this.Scheme + "_" + this.Control.Name + "_" + OnType.Changed;
        return this.Bind(id, Key, func);
    }

    public OnDown(id: string, func: CallbackType): iBindConfig {
        const Key = this.Scheme + "_" + this.Control.Name + "_" + OnType.Down;
        return this.Bind(id, Key, func);
    }

    public OnUp(id: string, func: CallbackType): iBindConfig {
        const Key = this.Scheme + "_" + this.Control.Name + "_" + OnType.Up;
        return this.Bind(id, Key, func);
    }

    public RemoveIgnoreGuiFunc(): this {
        this.CustomIgnoreGuiFunc = undefined;
        return this;
    }

    public SetConditionalIgnoreGuiFunc(f: (G: GuiObject) => boolean): this {
        this.CustomIgnoreGuiFunc = f;
        return this;
    }
}

// Make sure the value matches the key
const OnType: {Changed: "Changed", Down: "Down", Up: "Up"} = {
    Changed: "Changed",
    Down: "Down",
    Up: "Up"
}

export class Input {
    private readonly Bindings = new Collection<string, Collection<string, iBindConfig>>();
    private readonly Connections = new Collection<string, RBXScriptConnection>();

    private Paused = false;

    private static _instance: Input | undefined;

    public readonly Events = {
        OnBind: new Event<iBindConfig>(),
        OnBindRemove: new Event<iBindConfig>(),
        OnConfigUpdate: new Event<OnConfigUpdate>(),
        OnControlUpdate: new Event<ControlChange>()
    }

    private constructor() {
        this.Connections.Set("input_began", UserInputService.InputBegan.Connect((i, gpe) => this.OnEvent(i, gpe, OnType.Down)));
        this.Connections.Set("input_changed", UserInputService.InputChanged.Connect((i, gpe) => this.OnEvent(i, gpe, OnType.Changed)));
        this.Connections.Set("input_ended", UserInputService.InputEnded.Connect((i, gpe) => this.OnEvent(i, gpe, OnType.Up)));
    }

    /**
     * This effectively disconnects all bind functions and clears all bindings.
     * The Input class is reinstanced when a new binding happens on the controls.
     */
    public Destroy(): void {
        this.Bindings.Clear();
        this.Connections.ForEach(C => C.Disconnect());
        this.Connections.Clear();
        _G.Log("Input has been destroyed.", "Input");
        Input._instance = undefined;
    }

    public GetBindings(): Collection<string, Collection<string, iBindConfig>> {
        return this.Bindings;
    }

    public PauseInputs(): void {
        this.Paused = true;
    }

    public ResumeInputs(): void {
        this.Paused = false;
    }

    public static Instance(): Input {
        return Input._instance || (Input._instance = new Input());
    }

    private OnEvent(input: InputObject, gameProcessedEvent: boolean, onType: keyof typeof OnType): void {
        if (this.Paused) return;

        const Key = input.KeyCode.Name !== "Unknown" ? input.KeyCode.Name : input.UserInputType.Name;
        const KeyEnding = Key + "_" + onType;
        const Bindings = this.Bindings.Filter((_, k) => k.sub(-KeyEnding.size()) === KeyEnding);
        if (Bindings.Size() === 0) return;

        Bindings.ForEach((Binding, _) => {
            Binding.ForEach(C => {
                if (C.AmIIgnoringGameProccessedEvent() && gameProcessedEvent) return;
                C.GetCallback()(input);
                if (C.IsOnce()) C.Disconnect();
            });
        });
    }  

    public static readonly Controls: ControlsType = {
        KeyboardMouse: {
            CamBack:            new ControlData("KeyboardMouse", Enum.KeyCode.S),
            CamForward:         new ControlData("KeyboardMouse", Enum.KeyCode.W),
            CamLeft:            new ControlData("KeyboardMouse", Enum.KeyCode.A),
            CamLookDetect:      new ControlData("KeyboardMouse", Enum.UserInputType.MouseMovement, false),
            CamLookStart:       new ControlData("KeyboardMouse", Enum.UserInputType.MouseButton1, false),
            CamLookStartFlip:   new ControlData("KeyboardMouse", Enum.UserInputType.MouseButton2, false),
            CamRight:           new ControlData("KeyboardMouse", Enum.KeyCode.D),
            CamViewDown:        new ControlData("KeyboardMouse", Enum.KeyCode.Down),
            CamViewLeft:        new ControlData("KeyboardMouse", Enum.KeyCode.Left),
            CamViewRight:       new ControlData("KeyboardMouse", Enum.KeyCode.Right),
            CamViewUp:          new ControlData("KeyboardMouse", Enum.KeyCode.Up),
            CamZoomIn:          new ControlData("KeyboardMouse", Enum.KeyCode.I),
            CamZoomOut:         new ControlData("KeyboardMouse", Enum.KeyCode.O),
            CamZoomScroll:      new ControlData("KeyboardMouse", Enum.UserInputType.MouseWheel, false),
            GridAnchor:         new ControlData("KeyboardMouse", Enum.KeyCode.C),
            GridItemRotate:     new ControlData("KeyboardMouse", Enum.KeyCode.R),
            GridItemPlace:      new ControlData("KeyboardMouse", Enum.UserInputType.MouseButton1),
            Sprint:             new ControlData("KeyboardMouse", Enum.KeyCode.LeftShift),
            ToggleBuild:        new ControlData("KeyboardMouse", Enum.KeyCode.B),
            ToggleInventory:    new ControlData("KeyboardMouse", Enum.KeyCode.E),
            ToggleShop:         new ControlData("KeyboardMouse", Enum.KeyCode.Q),
        }
    }

    public static readonly DisplayCtrlMap = {
        "A": "🇦",
        "B": "🇧",
        "C": "🇨",
        "D": "🇩",
        "E": "🇪",
        "F": "🇫",
        "G": "🇬",
        "H": "🇭",
        "I": "🇮",
        "J": "🇯",
        "K": "🇰",
        "L": "🇱",
        "M": "🇲",
        "N": "🇳",
        "O": "🇴",
        "P": "🇵",
        "Q": "🇶",
        "R": "🇷",
        "S": "🇸",
        "T": "🇹",
        "U": "🇺",
        "V": "🇻",
        "W": "🇼",
        "X": "🇽",
        "Y": "🇾",
        "Z": "🇿",
        "0": "0️⃣",
        "1": "1️⃣",
        "2": "2️⃣",
        "3": "3️⃣",
        "4": "4️⃣",
        "5": "5️⃣",
        "6": "6️⃣",
        "7": "7️⃣",
        "8": "8️⃣",
        "9": "9️⃣",
        "Up": "⬆️",
        "Down": "⬇️",
        "Left": "⬅️",
        "Right": "➡️",
        "MouseButton1": "🖱️MB1",
        "MouseButton2": "🖱️MB2",
        "MouseWheel": "🖱️MWheel",
        "Space": "Spacebar",
        "Esc": "Esc",
    }

    public static C2S(control: typeof Input.Controls.KeyboardMouse[keyof typeof Input.Controls.KeyboardMouse]): string {
        return Input.DisplayCtrlMap[control.Control.Name as unknown as keyof typeof Input.DisplayCtrlMap] || control.Control.Name;
    }

    public static C2SDirect(control: keyof typeof Input.DisplayCtrlMap) {
        return Input.DisplayCtrlMap[control];
    }
}

class BindConfig implements RBXScriptConnection {

    private readonly bindingKey: string;
    private readonly func: CallbackType;
    private readonly key: UniqueInputTypes;
    private readonly id: string;

    public Connected = true;
    private ignoreGameProcessedEvent = false;
    private once = false;

    public constructor(id: string, bindingKey: string, key: UniqueInputTypes, func: CallbackType) {
        this.bindingKey = bindingKey;
        this.func = func;
        this.key = key;
        this.id = id;
    }

    public AmIIgnoringGameProccessedEvent(): boolean {
        return this.ignoreGameProcessedEvent;
    }

    public Disconnect(): void {
        const IBindings = Input.Instance().GetBindings();
        const Target = IBindings.Get(this.bindingKey)?.Get(this.id);
        if (!Target) return;

        // If there is only one binding left for the key, remove it.
        if (IBindings.Get(this.bindingKey)!.Size() === 1) {
            IBindings.Delete(this.bindingKey)
        } else {
            // Otherwise, just remove the string key.
            IBindings.Get(this.bindingKey)?.Delete(this.id);
        }

        Input.Instance().Events.OnBindRemove.Fire(Target);
        _G.Log(`Binding for ${this.key.Name} has been removed.`, "Input");
    }

    public GetCallback(): Callback {
        return this.func;
    }

    public GetKey(): InputType {
        return this.key;
    }

    public GetId(): string {
        return this.id;
    }

    /** Whether or not gameProcessedEvents should call the bind function. */ 
    public IgnoreGameProcessedEvent(yes: boolean): this {
        this.ignoreGameProcessedEvent = yes;

        Input.Instance().Events.OnConfigUpdate.Fire({
            Config: this,
            Flag: "IG",
            Added: yes
        });

        return this;
    }

    public IsOnce(): boolean {
        return this.once;
    }

    public SetOnce(yes: boolean): this {
        this.once = yes;

        Input.Instance().Events.OnConfigUpdate.Fire({
            Config: this,
            Flag: "Once",
            Added: yes
        });

        return this;
    }
}

class ControlChange {

    public readonly After: InputType;
    public readonly Before: InputType;
    public readonly Control: keyof typeof Input.Controls.KeyboardMouse;
    public readonly Scheme: keyof typeof Input.Controls;


    public constructor(scheme: keyof typeof Input.Controls, control: keyof typeof Input.Controls.KeyboardMouse, before: InputType, after: InputType) {
        this.Scheme = scheme;
        this.Control = control;
        this.Before = before;
        this.After = after;
    }
}