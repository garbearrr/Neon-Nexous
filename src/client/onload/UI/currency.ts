import { Players, TweenService } from "@rbxts/services";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";


export namespace UI.Currency {
    const Player = Players.LocalPlayer;
    const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
    const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

    const Money = MainUI.Top["3_Currency"]["1_Money"];
    const AltCurrency = MainUI.Top["3_Currency"]["2_AltCurrency"];

    const TweenLength = 0.4;
    const ShakeTweenLength = 0.2;

    // Separate tween variables for Money and AltCurrency
    let currentTweenMoney: Tween | undefined;
    let shakeTweenMoney: Tween | undefined;

    let currentTweenAltCurrency: Tween | undefined;
    let shakeTweenAltCurrency: Tween | undefined;

    // Flags to indicate if a tween is in progress
    let isTweeningMoney: boolean = false;
    let isTweeningAltCurrency: boolean = false;

    // Debounce flags to prevent rapid calls
    let canTweenMoney: boolean = true;
    let canTweenAltCurrency: boolean = true;

    const DebounceTime = 0.1; // Adjust as needed (in seconds)

    export const GetAltCurrencyText = () => {
        return AltCurrency.Container["2_MoneyText"]["MoneyText"];
    }

    export const GetMoneyText = () => {
        return Money.Container["2_MoneyText"]["MoneyText"];
    }

    export const TweenMoney = (from: BigNumber, to: BigNumber, isAltCurrency: boolean = false) => {
        if (isAltCurrency) {
            TweenAltCurrency(from, to);
        } else {
            TweenNormalMoney(from, to);
        }
    }

    /**
     * Handles tweening for normal Money.
     */
    const TweenNormalMoney = (from: BigNumber, to: BigNumber) => {
        if (!canTweenMoney) {
            print("TweenMoney (Normal) is on cooldown. Skipping this call.");
            return;
        }

        canTweenMoney = false;
        delay(DebounceTime, () => {
            canTweenMoney = true;
        });

        if (isTweeningAltCurrency) {
            print("Cannot tween Money while AltCurrency tween is in progress.");
            return;
        }

        if (isTweeningMoney) {
            print("TweenMoney (Normal) is already in progress. Skipping this call.");
            return;
        }

        isTweeningMoney = true;

        const MoneyText = GetMoneyText();
        const Grad = to.IsGreaterThan(from) ? MoneyText.AddUIGradient : MoneyText.TakeUIGradient;
        const NumberValue = MoneyText["Value"];

        const currentDisplayedValue = new BigNumber(NumberValue.Value);
        from = currentDisplayedValue;

        NumberValue.Value = tonumber(from.ToAbbreviatedString(true)) || 0;

        // Cancel existing tweens if any
        if (currentTweenMoney !== undefined && currentTweenMoney.PlaybackState === Enum.PlaybackState.Playing) {
            currentTweenMoney.Cancel();
            shakeTweenMoney?.Cancel();
            MoneyText.Rotation = 0;
        }

        const OriginalSize = MoneyText.Size;
        const NewSize = new UDim2(
            OriginalSize.X.Scale,
            OriginalSize.X.Offset,
            OriginalSize.Y.Scale + 0.13,
            OriginalSize.Y.Offset
        );
        MoneyText.Size = NewSize;

        Grad.Enabled = true;
        MoneyText.UIGradient.Enabled = false;

        const TI = new TweenInfo(TweenLength, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, 0, false, 0);
        const Connection = NumberValue.Changed.Connect(() => {
            MoneyText.Text = BigNumber.ToFixed(NumberValue.Value, BigNumber.ToFixedPrecision) + to.GetAbbreviation();
        });

        currentTweenMoney = TweenService.Create(NumberValue, TI, { Value: tonumber(to.ToAbbreviatedString(true)) || 0 });
        currentTweenMoney.Completed.Connect(() => {
            Connection.Disconnect();
            MoneyText.Text = to.ToAbbreviatedString();
            MoneyText.Size = OriginalSize;
            Grad.Enabled = false;
            MoneyText.UIGradient.Enabled = true;
            isTweeningMoney = false;
        });

        // Create and play shake tween
        const SIT = new TweenInfo(ShakeTweenLength, Enum.EasingStyle.Bounce, Enum.EasingDirection.InOut, 0, true, 0);
        shakeTweenMoney = TweenService.Create(MoneyText, SIT, { Rotation: -6 });
        shakeTweenMoney.Completed.Connect(() => {
            MoneyText.Rotation = 0;
        });

        currentTweenMoney.Play();
        shakeTweenMoney.Play();
    }

    /**
     * Handles tweening for AltCurrency.
     */
    const TweenAltCurrency = (from: BigNumber, to: BigNumber) => {
        if (!canTweenAltCurrency) {
            print("TweenMoney (AltCurrency) is on cooldown. Skipping this call.");
            return;
        }

        canTweenAltCurrency = false;
        delay(DebounceTime, () => {
            canTweenAltCurrency = true;
        });

        if (isTweeningAltCurrency) {
            print("TweenMoney (AltCurrency) is already in progress. Skipping this call.");
            return;
        }

        isTweeningAltCurrency = true;

        const MoneyText = GetAltCurrencyText();
        const Grad = to.IsGreaterThan(from) ? MoneyText.AddUIGradient : MoneyText.TakeUIGradient;
        const NumberValue = MoneyText["Value"];

        const currentDisplayedValue = new BigNumber(NumberValue.Value);
        from = currentDisplayedValue;

        NumberValue.Value = tonumber(from.ToAbbreviatedString(true)) || 0;

        // Cancel existing tweens if any
        if (currentTweenAltCurrency !== undefined && currentTweenAltCurrency.PlaybackState === Enum.PlaybackState.Playing) {
            currentTweenAltCurrency.Cancel();
            shakeTweenAltCurrency?.Cancel();
            MoneyText.Rotation = 0;
        }

        const OriginalSize = MoneyText.Size;
        const NewSize = new UDim2(
            OriginalSize.X.Scale,
            OriginalSize.X.Offset,
            OriginalSize.Y.Scale + 0.13,
            OriginalSize.Y.Offset
        );
        MoneyText.Size = NewSize;

        Grad.Enabled = true;
        MoneyText.UIGradient.Enabled = false;

        const TI = new TweenInfo(TweenLength, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, 0, false, 0);
        const Connection = NumberValue.Changed.Connect(() => {
            MoneyText.Text = BigNumber.ToFixed(NumberValue.Value, BigNumber.ToFixedPrecision) + to.GetAbbreviation();
        });

        currentTweenAltCurrency = TweenService.Create(NumberValue, TI, { Value: tonumber(to.ToAbbreviatedString(true)) || 0 });
        currentTweenAltCurrency.Completed.Connect(() => {
            Connection.Disconnect();
            MoneyText.Text = to.ToAbbreviatedString(false, 0);
            MoneyText.Size = OriginalSize;
            Grad.Enabled = false;
            MoneyText.UIGradient.Enabled = true;
            isTweeningAltCurrency = false;
        });

        // Preempt Money tween by cancelling it if running
        if (isTweeningMoney) {
            print("TweenMoney (AltCurrency) is preempting TweenMoney (Normal).");
            currentTweenMoney?.Cancel();
            shakeTweenMoney?.Cancel();
            const normalMoneyText = GetMoneyText();
            normalMoneyText.Rotation = 0;
            isTweeningMoney = false;
        }

        // Create and play shake tween
        const SIT = new TweenInfo(ShakeTweenLength, Enum.EasingStyle.Bounce, Enum.EasingDirection.InOut, 0, true, 0);
        shakeTweenAltCurrency = TweenService.Create(MoneyText, SIT, { Rotation: -6 });
        shakeTweenAltCurrency.Completed.Connect(() => {
            MoneyText.Rotation = 0;
        });

        currentTweenAltCurrency.Play();
        shakeTweenAltCurrency.Play();
    }

    const OnStart = () => {
        GetMoneyText().Text = "0";
        GetAltCurrencyText().Text = "0";
    }

    OnStart();
}
