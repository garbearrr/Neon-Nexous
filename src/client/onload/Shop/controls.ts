import { Input } from "client/modules/Input/Input";
import ShopActionButton from "../UI/ActionButtons/ShopActionButton";

Input.Controls.KeyboardMouse.ToggleShop.OnDown("shop_togg", () => {
    ShopActionButton.OnActivated();
});