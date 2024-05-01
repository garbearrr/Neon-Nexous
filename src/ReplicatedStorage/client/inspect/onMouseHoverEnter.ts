import { BaseClientItem } from "../item/types";

export const onMouseHoverEnter = (player: Player, Item: BaseClientItem) => {
    Item.Transparency = 0.7;
    Item.Color = Color3.fromRGB(20, 196, 209);
}