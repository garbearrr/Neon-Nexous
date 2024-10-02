import { Players, TweenService } from "@rbxts/services";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";


export namespace UI.Currency {
    const Player = Players.LocalPlayer;
    const PlayerGui = Player.WaitForChild("PlayerGui") as StarterGui;
    const MainUI = PlayerGui.WaitForChild("MainUI") as StarterGui["MainUI"];

    const Money = MainUI.Top["3_Currency"]["1_Money"];
    const AltCurrency = MainUI.Top["3_Currency"]["2_AltCurrency"];

    let currentTween: Tween | undefined;

    export const GetAltCurrencyText = () => {
        return AltCurrency["2_MoneyText"];
    }

    export const GetMoneyText = () => {
        return Money["2_MoneyText"];
    }

    export const TweenMoney = (from: BigNumber, to: BigNumber) => {
        const MoneyText = GetMoneyText();
        const Grad = to.IsGreaterThan(from) ? MoneyText.AddUIGradient : MoneyText.TakeUIGradient;
        const NumberValue = MoneyText["Value"];
        NumberValue.Value = tonumber(from.ToAbbreviatedString(true)) || 0;

        if (currentTween !== undefined) {
            currentTween.Cancel();
        }

        const OriginalSize = MoneyText.Size;
        const NewSize = new UDim2(OriginalSize.X.Scale, OriginalSize.X.Offset, OriginalSize.Y.Scale + 0.13, OriginalSize.Y.Offset);
        MoneyText.Size = NewSize;

        Grad.Enabled = true;

        const TI = new TweenInfo(0.4, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, 0, false, 0);
        const Connection = NumberValue.Changed.Connect(() => {
            MoneyText.Text = BigNumber.ToFixed(NumberValue.Value, BigNumber.ToFixedPrecision) + from.GetAbbreviation();
        });

        currentTween = TweenService.Create(NumberValue, TI, { Value: tonumber(to.ToAbbreviatedString(true)) || 0 });
        currentTween.Completed.Connect(() => {
            Connection.Disconnect();
            MoneyText.Text = to.ToAbbreviatedString();
            MoneyText.Size = OriginalSize;
            Grad.Enabled = false;
        });

        currentTween.Play();
    }

    const OnStart = () => {
        GetMoneyText().Text = "0";
        GetAltCurrencyText().Text = "0";
    }

    OnStart();
}