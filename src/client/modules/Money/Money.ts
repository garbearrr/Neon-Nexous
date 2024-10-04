import { UI } from "client/onload/UI/currency";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";

// Money for the UI
export namespace Money {
    const State = {
        Money: new BigNumber(0) ,
    }

    export const GetMoney = () => {
        return State.Money;
    }

    //Increment
    export const AddMoney = (Value: BigNumber) => {
        const Final = State.Money.Add(Value);
        UI.Currency.TweenMoney(State.Money, Final);
        State.Money = Final;
    }
<<<<<<< Updated upstream
=======

    //Decrement
    export const RemoveMoney = (Value: BigNumber) => {
        const Final = State.Money.Subtract(Value);
        UI.Currency.TweenMoney(State.Money, Final);
        State.Money = Final;
    }
>>>>>>> Stashed changes
}