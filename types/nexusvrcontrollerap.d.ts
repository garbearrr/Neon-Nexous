
interface NexusVRControllerAPI {
    /**
     * Sets the active camera. Invalid names will not throw an error and will output a warning instead.
     */
    SetActiveController(name: string): void;

    /**
     * Returns the name of the camera that is active.
     */
    GetActiveController(): string;

    /**
     * Enables or disables user inputs for the given hand CFrame, including movement, teleporting, and turning.
     * Invalid Enum.UserCFrames (Enum.UserCFrame.Head) will throw an error.
     */
    SetControllerInputEnabled(hand: Enum.UserCFrame, enabled: boolean): void;

    /**
     * Simple wrapper for setControllerInputEnabled(Enum.UserCFrame, true).
     */
    EnableControllerInput(hand: Enum.UserCFrame): void;

    /**
     * Simple wrapper for setControllerInputEnabled(Enum.UserCFrame, false).
     */
    DisableControllerInput(hand: Enum.UserCFrame): void;

    /**
     * Returns if the inputs for a given hand are enabled.
     * Invalid Enum.UserCFrames (Enum.UserCFrame.Head) will throw an error.
     */
    IsControllerInputEnabled(hand: Enum.UserCFrame): boolean;
}