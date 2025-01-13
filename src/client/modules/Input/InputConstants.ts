

export namespace InputConstants {
    export const MouseInputs: Set<MouseInputType> = new Set([
        Enum.UserInputType.MouseButton1,
        Enum.UserInputType.MouseButton2,
        Enum.UserInputType.MouseButton3,
        Enum.UserInputType.MouseWheel,
        Enum.UserInputType.MouseMovement
    ]);

    export const ControllerInputs: Set<ControllerKeyCode> = new Set([
        Enum.KeyCode.ButtonX,
        Enum.KeyCode.ButtonY,
        Enum.KeyCode.ButtonA,
        Enum.KeyCode.ButtonB,
        Enum.KeyCode.ButtonR1,
        Enum.KeyCode.ButtonL1,
        Enum.KeyCode.ButtonR2,
        Enum.KeyCode.ButtonL2,
        Enum.KeyCode.ButtonR3,
        Enum.KeyCode.ButtonL3,
        Enum.KeyCode.ButtonStart,
        Enum.KeyCode.ButtonSelect,
        Enum.KeyCode.DPadLeft,
        Enum.KeyCode.DPadRight,
        Enum.KeyCode.DPadUp,
        Enum.KeyCode.DPadDown,
        Enum.KeyCode.Thumbstick1,
        Enum.KeyCode.Thumbstick2
    ]);
}