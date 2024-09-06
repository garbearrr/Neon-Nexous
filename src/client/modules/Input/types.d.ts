interface iBindConfig extends RBXScriptConnection {
    AmIIgnoringGameProccessedEvent(): boolean;
    GetCallback(): CallbackType;
    GetKey(): InputType;
    GetId(): string
    /** Whether or not gameProcessedEvents should call the bind function. */ 
    IgnoreGameProcessedEvent(yes: boolean): iBindConfig;
    IsOnce(): boolean;
    /** Whether or not the bind function should be disconnected after it is called once. */
    SetOnce(yes: boolean): iBindConfig;
    /** Unbind bind function. */
    Disconnect(): void;

    Connected: boolean;
}

interface iControlData<T extends UniqueInputTypes> {
    /**
     * Disconnects all binds for the current control and its scheme.
     */
    DisconnectAll(): void;
    /**
     * Checks if a given key, button, mouse button, etc. is down.
     * @param Gamepad Optional argument to specify which gamepad to check.
     */
    IsDown(ignoreGui?: boolean, Gamepad?: Enum.UserInputType): boolean;
    /**
     * Bind a function to an input that fires on input change.
     * @param id Custom name identifer for your connection.
     * @param func The function to call on input change.
     */
    OnChanged(id: string, func: CallbackType): iBindConfig;
    /**
     * Bind a function to an input that fires on input down.
     * @param id Custom name identifer for your connection.
     * @param func The function to call on input down.
     */
    OnDown(id: string, func: CallbackType): iBindConfig;
    /**
     * Bind a function to an input that fires on input up.
     * @param id Custom name identifer for your connection.
     * @param func The function to call on input up.
     */
    OnUp(id: string, func: CallbackType): iBindConfig;
}


interface OnConfigUpdate {
    Config: iBindConfig;
    Flag: string;
    Added: boolean;
}

type CallbackType = (input: InputObject) => void;
type InputType = Enum.KeyCode | Enum.UserInputType;
type UniqueInputTypes = KeyboardMouseControls[keyof KeyboardMouseControls];

type ToStripKeyboard = 
    Enum.UserInputType.Accelerometer
    | Enum.UserInputType.Focus
    | Enum.UserInputType.Gamepad1
    | Enum.UserInputType.Gamepad2
    | Enum.UserInputType.Gamepad3
    | Enum.UserInputType.Gamepad4
    | Enum.UserInputType.Gamepad5
    | Enum.UserInputType.Gamepad6
    | Enum.UserInputType.Gamepad7
    | Enum.UserInputType.Gamepad8
    | Enum.UserInputType.Gyro
    | Enum.UserInputType.Keyboard
    | Enum.UserInputType.InputMethod
    | Enum.UserInputType.MouseMovement
    | Enum.UserInputType.MouseWheel
    | Enum.UserInputType.None
    | Enum.UserInputType.TextInput
    | Enum.UserInputType.Touch

type UserInputTypeKBStrip = Exclude<Enum.UserInputType, ToStripKeyboard>;


type KeyboardMouseControls = {
    CamBack:        Enum.KeyCode | UserInputTypeKBStrip;
    CamForward:     Enum.KeyCode | UserInputTypeKBStrip;
    CamLeft:        Enum.KeyCode | UserInputTypeKBStrip;
    /**This is intended to be used with OnChanged only.*/
    CamLookDetect:  Enum.UserInputType.MouseMovement;
    CamLookStart:   Enum.UserInputType.MouseButton1;
    CamLookStartFlip: Enum.UserInputType.MouseButton2;
    CamRight:       Enum.KeyCode | UserInputTypeKBStrip;
    CamViewDown:    Enum.KeyCode | UserInputTypeKBStrip;
    CamViewLeft:    Enum.KeyCode | UserInputTypeKBStrip;
    CamViewRight:   Enum.KeyCode | UserInputTypeKBStrip;
    CamViewUp:      Enum.KeyCode | UserInputTypeKBStrip;
    CamZoomIn:      Enum.KeyCode | UserInputTypeKBStrip;
    CamZoomOut:     Enum.KeyCode | UserInputTypeKBStrip;
    /**This is intended to be used with OnChanged only.*/
    CamZoomScroll:  Enum.UserInputType.MouseWheel;
    GridItemRotate: Enum.KeyCode | UserInputTypeKBStrip;
    GridItemPlace:  Enum.KeyCode | UserInputTypeKBStrip;
    ToggleBuild:    Enum.KeyCode | UserInputTypeKBStrip;
};

type KeyboardMouseControlData = {
    [K in keyof KeyboardMouseControls]: iControlData<KeyboardMouseControls[K]>;
};

type ControlsType = {
    KeyboardMouse: KeyboardMouseControlData;
};
