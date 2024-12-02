import { Input } from "client/modules/Input/Input";
import InvActionButton from "../UI/ActionButtons/InvActionButton";


Input.Controls.KeyboardMouse.ToggleInventory.OnDown("inv_togg", () => {
    InvActionButton.OnActivated();
});