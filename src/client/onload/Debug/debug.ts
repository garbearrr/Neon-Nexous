import { Debug } from "client/modules/Debug/Debug";
import { DebugItemImaging } from "client/modules/Debug/ItemImaging";
import { Sunset } from "client/modules/Sunset/Sunset";
import { DragBarWidget } from "client/modules/UI/DragBarWidget";


//Debug.Enable();

//DebugItemImaging.Activate();

new DragBarWidget("Change Time")
    .SetBounds(0, 24)
    .SetButtonIncrementDecrement(1)
    .SetUpdateCallback(() => {
        return Sunset.GetTime();
    })
    .SetActionCallback((Value) => {
        Sunset.SetTime(Value);
    })
    .Update();