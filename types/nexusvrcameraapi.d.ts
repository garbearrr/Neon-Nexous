interface NexusVRCameraAPI {
    /**
     * Returns the name of the camera that is active.
     */
    GetActiveCamera: () => string;
    /**
     * Sets the active camera. Invalid names will not throw an error and will output a warning instead.
     */
    SetActiveCamera: (name: string) => void;
}