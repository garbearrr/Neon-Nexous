import { BaseClientItem } from "ReplicatedStorage/client/item/types";
import { ClientBuildState } from "../types";
import { configureItemGuide } from "./configureItemGuide";

export const setNewItem = (State: ClientBuildState, Item: BaseClientItem) => {
    State.Item = Item;
    State.ItemGuide.Destroy();
    State.ItemGuide = Item.Clone();
    configureItemGuide(State.ItemGuide);
}