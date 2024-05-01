type NexusAPINames = "Backpack" | "Camera" | "Controller" | "Input" | "Menu" | "Settings";

type NexusAPIMappings = {
    Backpack: NexusVRBackpackAPI;
    Camera: NexusVRCameraAPI;
    Controller: NexusVRControllerAPI;
    Input: NexusVRInputAPI;
    Menu: NexusVRMenuAPI;
    Settings: NexusVRSettingsAPI;
}

interface NexusVRCharacterModel {
    Api: {
        Backpack: NexusVRBackpackAPI;
        Camera: NexusVRCameraAPI;
        Controller: NexusVRControllerAPI;
        Input: NexusVRInputAPI;
        Menu: NexusVRMenuAPI;
        Settings: NexusVRSettingsAPI;
        /**
         * Event for when an API is registered. The name of the API is passed as the parameter
         */
        Registered: unknown;
        /**
         * Invokes a callback when an API is registered with a given name. If it is already registered, the callback will run asynchronously. This is intended for setting up an API call without blocking for WaitFor.
         */
        OnRegistered: (api: NexusAPINames, callback: () => void) => void;
        /**
         * Stores an API that can be referenced. If the API is already stored, an error will be thrown. 
         */
        Register: (name: string, api: NexusAPINames) => void;
        /**
         * Waits for an API to be registered and returns the API. If it was already registered, it returns the API without waiting. Similar to instances, this would be treated like WaitForChild where the usage is optional instead of indexing (ex: API:WaitFor("MyApi") vs API.MyApi`) as long as the consequences of an API not being registered are accepted.
         */
        WaitFor: <T extends NexusAPINames>(api: T) => NexusAPIMappings[T];
    }
}