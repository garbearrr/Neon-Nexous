
export namespace UIUtil {
    /**
     * Shakes a UI element for a specified duration and intensity, then resets it to its original position.
     * @param uiElement The UI element to shake (e.g., Frame, TextLabel, ImageLabel).
     * @param duration The duration of the shake effect (in seconds).
     * @param intensity The intensity of the shake (higher values mean more movement).
     */
    export const ShakeUIElement = (uiElement: GuiObject, duration: number, intensity: number) => {
        const originalPosition = uiElement.Position;
        const endTime = tick() + duration;

        // Shake the UI element until the duration ends
        while (tick() < endTime) {
            // Random offset for shake effect
            const offsetX = (math.random() - 0.5) * intensity;
            const offsetY = (math.random() - 0.5) * intensity;

            // Apply the random offset to the UI element's position
            uiElement.Position = originalPosition.add(new UDim2(0, offsetX, 0, offsetY));

            // Wait a short duration before the next shake
            wait(0.05);
        }

        // Reset the UI element's position back to its original position
        uiElement.Position = originalPosition;
    };

    export const ShakeViaRotation = (uiElement: GuiObject, duration: number, min = math.rad(-90), max = math.rad(90)) => {
        const originalRotation = uiElement.Rotation;
        const endTime = tick() + duration;

        // Shake the UI element until the duration ends
        while (tick() < endTime) {
            // Random rotation for shake effect
            const rotation = math.random(min, max);

            // Apply the random rotation to the UI element
            uiElement.Rotation = rotation;

            // Wait a short duration before the next shake
            wait(0.05);
        }

        // Reset the UI element's rotation back to its original rotation
        uiElement.Rotation = originalRotation;
    }
}