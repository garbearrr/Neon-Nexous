import { UI } from "client/onload/UI/currency";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";
import { Common } from "shared/modules/Common/Common";
import { Inventory } from "../Inventory/Inventory";


export namespace Money {
    const State = {
        Money: new BigNumber(0),
    }

    export const GetMoney = () => {
        return State.Money;
    }

    export const AddMoney = (Value: BigNumber) => {
        const Final = State.Money.Add(Value);
        UI.Currency.TweenMoney(State.Money, Final);
        State.Money = Final;
        _G.Log(`Added ${Value.ToString()} to Money.`, "Money");
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
        const Final = State.Money.Subtract(Value);
        UI.Currency.TweenMoney(State.Money, Final);
        State.Money = Final;
        _G.Log(`Removed ${Value.ToString()} from Money.`, "Money");
    }
}