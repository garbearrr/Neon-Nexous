import { Money } from "client/modules/Money/Money";
import { BigNumber } from "shared/modules/BigNumber/BigNumber";

export const DefaultMoney = () => {
    Money.AddMoney(new BigNumber(1000), false);
}

DefaultMoney();