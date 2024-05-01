import { CBC } from "../constants";


export const makeItemColor = (Item: Part, Color: Color3) => {
    for (const Descendant of Item.GetDescendants()) {
        if (!Descendant.IsA("BasePart")) continue;
        if (Descendant.Transparency === 1) continue;

        Descendant.Transparency = CBC.HITBOX_GUIDE_TRANS;
        Descendant.Color = Color;
    }

    Item.Color = Color;
}