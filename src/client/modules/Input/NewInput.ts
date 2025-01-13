import { Collection } from "shared/modules/Collection/Collection";
import { InputConstants } from "./InputConstants";
import { UserInputService } from "@rbxts/services";
import { Event } from "shared/modules/Event/Event";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";
import { NewUtil } from "shared/modules/Util/Util";

export namespace Input {

    const Listeners = new Collection<string, InputListner>();
    const ControlListenersCache = new Map<ValidActivationControl, InputListner[]>(); // Cache as arrays

    UserInputService.InputBegan.Connect((Input, Processed) => {
        if (Processed) {
            return;
        }

        DispatchInput(Input, "OnDown");
    });

    UserInputService.InputEnded.Connect((Input, Processed) => {
        if (Processed) {
            return;
        }

        DispatchInput(Input, "OnUp");
    });

    UserInputService.InputChanged.Connect((Input, Processed) => {
        if (Processed) {
            return;
        }

        DispatchInput(Input, "OnChanged");
    });

    export const Control = (Name: keyof ControlBindings) => {
        const Listener = Listeners.Get(Name);
        if (Listener === undefined) {
            throw `Control "${Name}" does not exist.`;
        }

        return Listener as InputListnerBindOnly;
    }

    /**
     * Creates a new input listener with optional priority and cooldown.
     * @param Name The unique name of the listener.
     * @param priority The priority of the listener. Higher values indicate higher priority.
     * @param cooldown The cooldown duration in seconds.
     * @returns A new InputListner instance.
     */
    export const NewListener = (Name: string, priority = 0, cooldown = 0): InputListnerEdit & InputListnerBindOnly => {
        return new InputListner(Name, priority, cooldown);
    }

    export const RemoveListener = (Name: string): boolean => { // Optional removal method
        const listener = Listeners.Get(Name);
        if (!listener) return false;

        // Remove from ControlListenersCache
        for (const control of listener.ActivationControls) {
            const listeners = ControlListenersCache.get(control);
            if (listeners) {
                const index = listeners.indexOf(listener);
                if (index !== -1) {
                    NewUtil.Array.Splice(listeners, index, 1);
                }
                if (listeners.size() === 0) {
                    ControlListenersCache.delete(control);
                }
            }
        }

        // Remove from Listeners collection
        Listeners.Delete(Name);
        return true;
    }

    /**
     * InputListner
     * 
     * Used to create a new input listener and later to bind events to it.
     */
    class InputListner {
        public readonly ActivationControls: Set<ValidActivationControl> = new Set();
        public readonly ID = Listeners.Size();
        public readonly Name: string;

        private Controller: boolean = false;
        private Keyboard: boolean = false;
        private Mouse: boolean = false;

        public readonly OnDown: Event<InputObject> = new Event();
        public readonly OnUp: Event<InputObject> = new Event();
        public readonly OnChanged: Event<InputObject> = new Event();

        // New Properties for Priority and Cooldown
        public priority: number;
        public cooldown: number; // in seconds
        private onCooldown: boolean = false;

        constructor(Name: string, priority = 0, cooldown = 0) {
            this.Name = Name;
            this.priority = priority;
            this.cooldown = cooldown;

            Listeners.Set(Name, this);
        }

        /**
         * Sets the priority of the listener.
         * @param priority The priority value.
         */
        public SetPriority(priority: number): this {
            this.priority = priority;

            // Re-sort listeners in all activation controls
            for (const control of this.ActivationControls) {
                const listeners = ControlListenersCache.get(control);
                if (listeners) {
                    listeners.sort((a, b) => {
                        return a.priority > b.priority
                    });
                }
            }

            return this;
        }

        /**
         * Sets the cooldown duration of the listener.
         * @param cooldown The cooldown duration in seconds.
         */
        public SetCooldown(cooldown: number): this {
            this.cooldown = cooldown;
            return this;
        }

        /**
         * Checks if the listener is currently on cooldown.
         * @returns True if on cooldown, else false.
         */
        public IsOnCooldown(): boolean {
            return this.onCooldown;
        }

        /**
         * Activates the cooldown for the listener.
         */
        private ActivateCooldown(): void {
            if (this.cooldown > 0) {
                this.onCooldown = true;
                Scheduling.SetTimeout(() => {
                    this.onCooldown = false;
                }, this.cooldown);
            }
        }

        /**
         * Fire the appropriate event if not on cooldown.
         * @param eventType The type of event.
         * @param input The input object.
         */
        public FireEvent(eventType: "OnDown" | "OnUp" | "OnChanged", input: InputObject): boolean {
            if (this.IsOnCooldown()) {
                return false;
            }

            switch (eventType) {
                case "OnDown":
                    this.OnDown.Fire(input);
                    break;
                case "OnUp":
                    this.OnUp.Fire(input);
                    break;
                case "OnChanged":
                    this.OnChanged.Fire(input);
                    break;
            }

            this.ActivateCooldown();
            return true; // Indicate that the event was fired
        }

        // Creation Methods

        /**
         * Add a control to the list of controls that will activate this input listener.
         * @param Controls The controls to add.
         */
        public AddActivationControls(...Controls: Array<ValidActivationControl>): this {
            for (const Control of Controls) {
                if (this.ActivationControls.add(Control)) { // Only proceed if the control was not already present
                    // Add listener to the cache
                    if (!ControlListenersCache.has(Control)) {
                        ControlListenersCache.set(Control, []);
                    }
                    const listeners = ControlListenersCache.get(Control)!;

                    // Insert listener in sorted order based on priority
                    let inserted = false;
                    for (let i = 0; i < listeners.size(); i++) {
                        if (this.priority > listeners[i].priority) {
                            NewUtil.Array.Insert(listeners, i, this);
                            inserted = true;
                            break;
                        }
                    }
                    if (!inserted) {
                        listeners.push(this);
                    }

                    this.ClassifyInputType(Control);
                }
            }

            return this;
        }

        /**
         * Classifies the input type for control filtering.
         * @param Control The control to classify.
         */
        private ClassifyInputType(Control?: ValidActivationControl): void {
            if (Control === undefined) {
                // Call this method for each control in the activation controls.
                this.ActivationControls.forEach((Control) => {
                    this.ClassifyInputType(Control);
                });

                return;
            }

            if (InputConstants.ControllerInputs.has(Control as ControllerKeyCode)) {
                this.Controller = true;
            } else if (InputConstants.MouseInputs.has(Control as MouseInputType)) {
                this.Mouse = true;
            } else {
                this.Keyboard = true;
            }
        }

        /**
         * Used to edit the input listener when obtained directly from the Input namespace.
         */
        public Edit(): InputListnerEdit & InputListnerBindOnly {
            return this;
        }

        /**
         * Remove a control from the list of controls that will activate this input listener.
         * @param Controls The controls to remove.
         */
        public RemoveActivationControls(...Controls: Array<ValidActivationControl>): this {
            for (const Control of Controls) {
                if (this.ActivationControls.delete(Control)) { // Only proceed if the control was present
                    // Remove listener from the cache
                    const listeners = ControlListenersCache.get(Control);
                    if (listeners) {
                        const index = listeners.indexOf(this);
                        if (index !== -1) {
                            NewUtil.Array.Splice(listeners, index, 1);
                        }
                        if (listeners.size() === 0) {
                            ControlListenersCache.delete(Control);
                        }
                    }

                    this.ClassifyInputType();
                }
            }

            return this;
        }
    }

    /**
     * Dispatches the input to all relevant listeners.
     * @param input The input object received from UserInputService.
     * @param eventType The type of event ("OnDown", "OnUp", "OnChanged").
     */
    const DispatchInput = (input: InputObject, eventType: "OnDown" | "OnUp" | "OnChanged"): void => {
        const control = GetValidActivationControl(input);

        if (!control) return; // Ignore if the input is not a valid activation control

        const listeners = ControlListenersCache.get(control);
        if (!listeners) return; // No listeners for this control

        // Iterate through listeners sorted by priority
        for (const listener of listeners) {
            if (listener.IsOnCooldown()) {
                continue; // Skip if on cooldown
            }

            // Fire the event
            const handled = listener.FireEvent(eventType, input);

            // Optionally, implement a blocking mechanism if needed
            // if (handled) {
            //     break;
            // }
        }
    }

    /**
     * Converts an InputObject to a ValidActivationControl if applicable.
     * @param input The InputObject from UserInputService.
     * @returns The corresponding ValidActivationControl or undefined.
     */
    const GetValidActivationControl = (input: InputObject): ValidActivationControl | undefined => {
        // Check if the input is a KeyCode or one of the Gamepad types
        if (
            input.UserInputType === Enum.UserInputType.Keyboard ||
            input.UserInputType === Enum.UserInputType.Gamepad1 ||
            input.UserInputType === Enum.UserInputType.Gamepad2 ||
            input.UserInputType === Enum.UserInputType.Gamepad3 ||
            input.UserInputType === Enum.UserInputType.Gamepad4 ||
            input.UserInputType === Enum.UserInputType.Gamepad5 ||
            input.UserInputType === Enum.UserInputType.Gamepad6 ||
            input.UserInputType === Enum.UserInputType.Gamepad7 ||
            input.UserInputType === Enum.UserInputType.Gamepad8
        ) {
            return input.KeyCode as ValidActivationControl;
        }

        // Check if the input is a valid MouseInputType
        if (InputConstants.MouseInputs.has(input.UserInputType as MouseInputType)) {
            return input.UserInputType as ValidActivationControl;
        }

        // Add other conditions as necessary

        return undefined; // Input does not match any valid activation control
    }
}
