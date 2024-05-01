import { BaseClientItem } from "../item/types";


export const onMouseHoverLeave = (player: Player, Item: BaseClientItem) => {
    Item.Transparency = 1;
}