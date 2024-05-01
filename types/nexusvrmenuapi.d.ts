interface MenuView {
    Name: string;
    Visible: boolean; // [ReadOnly]

    /**
     * Returns the container frame used for the view. The size should not be assumed to be fixed.
     */
    GetContainer(): Frame;

    /**
     * Adds the standard background to the view.
     */
    AddBackground(): void;

    /**
     * Destroys the view and removes it from the menu.
     */
    Destroy(): void;
}

interface NexusVRMenuAPI {
    Enabled: boolean;

    /**
     * Returns if the menu is visible.
     */
    IsOpen(): boolean;

    /**
     * Opens the menu. Does nothing if the menu is already open.
     */
    Open(): void;

    /**
     * Closes the menu. Does nothing if the menu is not open.
     */
    Close(): void;

    /**
     * Creates and adds a page to the menu. The initial name is the name that will appear to the user sees the view.
     */
    CreateView(initialName: string): MenuView;
}