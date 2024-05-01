
interface NexusVRBackpackAPI {
    /**
     * Returns if the backpack is enabled or not.
     */
    GetBackpackEnabled: () => boolean;
    /**
     * Enables or disables the backpack.
     */
    SetBackpackEnabled: (enabled: boolean) => void;
    /**
     * Changes the key to open the backpack from the Right Thumbstick.
     */
    SetKeyCode: (keyCode: Enum.KeyCode) => void;
    /**
     * Changes the UserCFrame the backpack will open at from the Right Hand.
     */
    SetUserCFrame: (cf: Enum.UserCFrame) => void;
}