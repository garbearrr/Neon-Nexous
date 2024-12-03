import { UI } from "client/onload/UI/level";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";
import { Event } from "shared/modules/Event/Event";

// Define the LevelUp event payload interface
interface LevelUpPayload {
    PreviousLevel: number;
    NewLevel: number;
}

export namespace Level {
    const BASE_AMOUNT = 200;

    // Internal state using BigNumber for XP
    const State = {
        Level: 1,
        XP: new BigNumber(0),
    };

    // Events exposed by the Level namespace
    export const Events = {
        LevelUp: new Event<LevelUpPayload>(),
    };

    /**
     * Adds a specified number of levels to the player's current level.
     * Resets XP based on the new level's cumulative XP requirement.
     * @param Amount Number of levels to add.
     */
    export const AddLevel = (Amount: number) => {
        if (Amount <= 0) return; // Prevent adding non-positive levels
        const previousLevel = State.Level;
        State.Level += Amount;
        State.XP = CalculateCumulativeXP(State.Level);
        // Fire LevelUp event for each level added
        for (let i = 1; i <= Amount; i++) {
            Events.LevelUp.Fire({
                PreviousLevel: previousLevel + i - 1,
                NewLevel: previousLevel + i,
            });
        }
    };

    /**
     * Adds XP to the player's current XP.
     * @param Amount XP to add as a BigNumber.
     */
    export const AddXP = (Amount: BigNumber) => {
        if (Amount.IsLessThan(new BigNumber(0))) return; // Prevent adding negative XP
        State.XP = State.XP.Add(Amount);

        // Round XP to avoid floating-point precision issues
        const roundedXP = new BigNumber(math.floor(State.XP.ToNumber() * 1000) / 1000);
        State.XP = roundedXP;

        const XPRequiredForNextLevel = CalculateCumulativeXP(State.Level + 1);
        //print("XPRequiredForNextLevel: " + XPRequiredForNextLevel.ToNumber(), "XP: " + State.XP.ToNumber());
        if (State.XP.IsGreaterThanOrEqualTo(XPRequiredForNextLevel)) {
            SetLevelByXP(State.XP);
        }
    };

    /**
     * Calculates the cumulative XP required for a given level using quadratic progression.
     * @param Level The target level.
     * @returns A BigNumber representing the cumulative XP required.
     */
    export const CalculateCumulativeXP = (Level: number): BigNumber => {
        return new BigNumber(BASE_AMOUNT * Level ** 2);
    };

    /**
     * Retrieves the player's current level.
     * @returns Current level as a number.
     */
    export const GetLevel = (): number => State.Level;

    /**
     * Retrieves the player's current XP.
     * @returns Current XP as a BigNumber.
     */
    export const GetXP = (): BigNumber => State.XP;

    /**
     * Removes a specified amount of XP from the player's current XP.
     * @param Amount XP to remove as a BigNumber.
     */
    export const TakeXP = (Amount: BigNumber) => {
        if (Amount.IsLessThan(new BigNumber(0))) return; // Prevent removing negative XP
        State.XP = State.XP.Subtract(Amount);

        if (State.XP.IsLessThan(new BigNumber(0))) {
            State.XP = new BigNumber(0); // Prevent negative XP
        }

        const XPRequiredForCurrentLevel = CalculateCumulativeXP(State.Level);
        if (State.XP.IsLessThan(XPRequiredForCurrentLevel)) {
            SetLevelByXP(State.XP);
        }
    };

    /**
     * Sets the player's level directly, resetting XP based on the new level.
     * @param Amount The level to set.
     */
    export const SetLevel = (Amount: number) => {
        if (Amount < 1) Amount = 1; // Ensure level doesn't go below 1
        const previousLevel = State.Level;
        State.Level = Amount;
        State.XP = CalculateCumulativeXP(Amount);
        // Fire LevelUp event if the level increased
        if (Amount > previousLevel) {
            Events.LevelUp.Fire({
                PreviousLevel: previousLevel,
                NewLevel: Amount,
            });
        }

        UI.Level.UpdateLevel(Amount);
    };

    /**
     * Sets the player's level based on their current XP.
     * Adjusts the level and fires LevelUp events as necessary.
     * @param XP The current XP as a BigNumber.
     */
    export const SetLevelByXP = (XP: BigNumber) => {
        let level = State.Level;
        let remainingXP = XP;

        while (remainingXP.IsGreaterThanOrEqualTo(CalculateCumulativeXP(level + 1))) {
            const xpForNextLevel = CalculateCumulativeXP(level + 1);
            remainingXP = remainingXP.Subtract(xpForNextLevel);
            const previousLevel = level;
            level += 1;

            Events.LevelUp.Fire({
                PreviousLevel: previousLevel,
                NewLevel: level,
            });

            if (level > 1000) { // Prevent potential infinite loops
                warn("Maximum level reached or XP calculation error.");
                break;
            }
        }

        State.Level = level;
        State.XP = remainingXP;

        UI.Level.UpdateLevel(level);
    };

    /**
     * Sets the player's XP directly and adjusts the level accordingly.
     * @param Amount The XP to set as a BigNumber.
     */
    export const SetXP = (Amount: BigNumber) => {
        State.XP = Amount;
        SetLevelByXP(State.XP);
    };

    export const UpdateGraphic = () => {
        UI.Level.UpdateGraphic(State.XP, CalculateCumulativeXP(State.Level + 1), State.Level);
    };

    UpdateGraphic();
}
