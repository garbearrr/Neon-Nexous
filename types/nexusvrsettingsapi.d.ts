
interface NexusVRSettingsAPI {
    /**
     * Returns the value of a setting.
     */
    GetSetting(setting: string): any;

    /**
     * Sets the value of a setting. Not all settings support being changed after loading.
     */
    SetSetting(setting: string, value: any): void;

    /**
     * Returns an event that is invoked when the value of a setting is changed.
     */
    GetSettingsChangedSignal(settingName: string): unknown;
}