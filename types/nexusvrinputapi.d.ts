
interface NexusVRInputAPI {
    /**
     * Recenters the service. Does not alter the Y axis.
     */
    Recenter(): void;

    /**
     * Sets the eye level.
     */
    SetEyeLevel(): void;

    Recentered: unknown;
    EyeLevelSet: unknown;
}