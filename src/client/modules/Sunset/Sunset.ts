// Sunset.client.ts

import { Lighting, TweenService } from "@rbxts/services";
import { Collection } from "shared/modules/Collection/Collection";
import { Event } from "shared/modules/Event/Event";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";

// Day/Night cycle module
export namespace Sunset {
    const DEFAULT_CYCLE_SPEED = 0.05; // in-game hour per real second
    const MIN_CYCLE_SPEED = 0.001;
    const MAX_CYCLE_SPEED = 1;

    const Connections = new Collection<string, () => void>(); // Store cleanup functions

    const State = {
        CycleSpeed: DEFAULT_CYCLE_SPEED,
        IsRunning: false,
    }

    export const Events = {
        TimeChanged: new Event<number>(),
    }

    // Update interval in seconds
    const UPDATE_INTERVAL = 0.05; // 0.5 seconds

    // Start the cycle
    export const Start = () => {
        if (State.IsRunning) return;

        State.IsRunning = true;

        // Use Scheduling.SetInterval to update every half second
        const cleanup = Scheduling.SetInterval(() => {
            let CurrentClockTime = Lighting.ClockTime;
            // Increment ClockTime based on CycleSpeed and interval
            CurrentClockTime += State.CycleSpeed * UPDATE_INTERVAL;

            // Wrap around 24 hours
            if (CurrentClockTime >= 24) CurrentClockTime -= 24;
            if (CurrentClockTime < 0) CurrentClockTime += 24;

            Lighting.ClockTime = CurrentClockTime;
            Events.TimeChanged.Fire(CurrentClockTime);
        }, UPDATE_INTERVAL);

        Connections.Set("Cycle", cleanup);
        _G.Log("Day/Night cycle started", "Sunset");
    }

    // Stop the cycle
    export const Stop = (DestroyEvents = false) => {
        if (!State.IsRunning) return;

        State.IsRunning = false;
        Connections.ForEach((cleanup) => cleanup());
        Connections.Clear();

        if (DestroyEvents) {
            Events.TimeChanged.Destroy();
        }

        _G.Log("Day/Night cycle stopped", "Sunset");
    }

    // Pause the cycle
    export const Pause = () => {
        Stop();
        _G.Log("Day/Night cycle paused", "Sunset");
    }

    // Resume the cycle
    export const Resume = () => {
        Start();
        _G.Log("Day/Night cycle resumed", "Sunset");
    }

    // Set the current time
    export const SetTime = (Time: number) => {
        const ClampedTime = ClampTime(Time);
        Lighting.ClockTime = ClampedTime;
        Events.TimeChanged.Fire(ClampedTime);
        _G.Log(`Time set to ${ClampedTime}`, "Sunset");
    }

    /**
     * Set the current time normalized
     * @param Time Between 0 and 1
     */
    export const SetTimeNormalized = (Time: number) => {
        const LerpedTime = Lerp(0, 24, Time);
        SetTime(LerpedTime);
        _G.Log(`Time set to ${LerpedTime}`, "Sunset");
    }

    // Get the current time
    export const GetTime = (): number => {
        return Lighting.ClockTime;
    }

    // Skip to day (6 AM)
    export const SkipToDay = (duration: number = 2) => {
        TweenToTime(6, duration);
        _G.Log("Skipping to day", "Sunset");
    }

    // Skip to night (18 PM)
    export const SkipToNight = (duration: number = 2) => {
        TweenToTime(18, duration);
        _G.Log("Skipping to night", "Sunset");
    }

    /**
     * Set the cycle speed
     * @param speed Between 0 and 1
     */
    export const SetCycleSpeed = (speed: number) => {
        State.CycleSpeed = Lerp(MIN_CYCLE_SPEED, MAX_CYCLE_SPEED, speed);
        _G.Log(`Cycle speed set to ${State.CycleSpeed}`, "Sunset");
    }

    // Get the current cycle speed
    export const GetCycleSpeed = (): number => {
        return State.CycleSpeed;
    }

    // Check if it's currently day
    export const IsDay = (): boolean => {
        const CurrentTime = Lighting.ClockTime;
        return CurrentTime >= 6 && CurrentTime < 18;
    }

    // Check if it's currently night
    export const IsNight = (): boolean => {
        return !IsDay();
    }

    // Listen for time changes
    export const OnTimeChanged = (callback: (currentTime: number) => void) => {
        Events.TimeChanged.Connect(callback);
    }

    // Helper const to clamp time between 0 and 24
    const ClampTime = (Time: number): number => {
        let Clamped = Time;
        while (Clamped >= 24) Clamped -= 24;
        while (Clamped < 0) Clamped += 24;
        return Clamped;
    }

    const Lerp = (a: number, b: number, t: number): number => {
        return a + (b - a) * math.clamp(t, 0, 1);
    }

    // Helper const to tween to a specific time
    const TweenToTime = (TargetTime: number, Duration: number) => {
        // Calculate the shortest path to the target time
        const CurrentTime = Lighting.ClockTime;
        let Delta = TargetTime - CurrentTime;
        if (Delta > 12) Delta -= 24;
        if (Delta < -12) Delta += 24;

        const FinalTime = ClampTime(CurrentTime + Delta);

        // Use TweenService to smoothly transition ClockTime
        const TI = new TweenInfo(Duration, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);
        const TweenProps = { ClockTime: FinalTime };
        const Tween = TweenService.Create(Lighting, TI, TweenProps);

        // Update cycleSpeed to match the tween
        SetCycleSpeed(Delta / Duration);

        Tween.Play();

        // Optional: Reset cycleSpeed after tween completes
        Tween.Completed.Connect(() => {
            SetCycleSpeed(DEFAULT_CYCLE_SPEED);
        });
    }
}
