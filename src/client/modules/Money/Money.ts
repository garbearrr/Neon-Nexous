import { UI } from "client/onload/UI/currency";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";
import { Common } from "shared/modules/Common/Common";
import { Inventory } from "../Inventory/Inventory";
import { Level } from "../Level/Level";


export namespace Money {
    const State = {
        AltCurrency: new BigNumber(0),
        Money: new BigNumber(0),
        PendingAdd: new BigNumber(0),
    }

    Level.Events.LevelUp.Connect(() => AddAltCurrency());

    export const GetMoney = () => {
        return State.Money;
    }

    export const AddAltCurrency = (Value: BigNumber = new BigNumber(5)) => {
        const Final = State.AltCurrency.Add(Value);
        UI.Currency.TweenMoney(State.AltCurrency, Final, true);
        State.AltCurrency = Final;
        _G.Log(`Added ${Value.ToString()} to AltCurrency.`, "Money");
    }

    export const AddMoney = (Value: BigNumber, AddXP = true, UpdateUi = true) => {
        if (AddXP) {
            Level.AddXP(Value);
        }

        State.Money = State.Money.Add(Value);

        if (UpdateUi) {
            UpdateUI();
        }

        _G.Log(`Added ${Value.ToString()} to Money.`, "Money");
    }


    export const UpdateUI = () => {
        const From = State.PendingAdd.Clone();
        const To = State.Money.Clone();

        if (State.PendingAdd.IsEqualTo(State.Money)) {
            return;
        }

        State.PendingAdd = State.Money.Clone();
        UI.Currency.TweenMoney(From, To);
    }
    

    export const BuyItem = (PID: number): boolean => {
        const Item = Common.GetItemById(PID);
        if (Item === undefined) {
            _G.Log(`Item ${PID} not found. (BuyItem)`, "Money");
            return false;
        }

        const Cost = new BigNumber(Item.Stats.Cost.Value);
        if (State.Money.IsLessThan(Cost)) {
            _G.Log(`Not enough money to buy item ${PID}.`, "Money");
            return false;
        }

        RemoveMoney(Cost);
        Inventory.AddItem(PID);
        _G.Log(`Bought item ${PID} for ${Cost.ToString()}.`, "Money");
        return true;
    }

    export const RemoveMoney = (Value: BigNumber) => {
        State.Money = State.Money.Subtract(Value);
        UpdateUI();
        _G.Log(`Removed ${Value.ToString()} from Money.`, "Money");
    }
}