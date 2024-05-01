import { TweenService, Workspace } from "@rbxts/services";
import { ClientBuildState } from "../types";
import { CBC } from "../constants";
import { ClientItem } from "ReplicatedStorage/client/item/types";
import { canPlaceItem } from "./canPlaceItem";
import { getItemMod } from "./getItemMod";

const HitBoxMarkGuide = new Instance("Part");
HitBoxMarkGuide.Name = "HitBoxMarkGuide";
HitBoxMarkGuide.Anchored = true;
HitBoxMarkGuide.CanCollide = false;
HitBoxMarkGuide.Parent = Workspace;
HitBoxMarkGuide.Transparency = 1;

export const startOrUpdateTween = (State: ClientBuildState, Pos: Vector3, Rot: Vector3) => {
    if (!State.DragCache.IsEmpty()) return;

    if (State.CurrentTween)
        State.CurrentTween.Cancel();

    const TargetCFrame = new CFrame(Pos).mul(CFrame.Angles(
        Rot.X,
        Rot.Y,
        Rot.Z
    ));

    const Item = State.ItemGuide as ClientItem;

    const Mod = getItemMod(Item);

    Mod.FireMoved();

    const PosDiff = new Vector3 (
        Item.Position.X - Item.CollisionHitbox.Position.X,
        Item.Position.Y - Item.CollisionHitbox.Position.Y,
        Item.Position.Z - Item.CollisionHitbox.Position.Z
    );

    const TargetCHitbox = TargetCFrame.sub(PosDiff);

    HitBoxMarkGuide.Size = Item.CollisionHitbox.Size;
    HitBoxMarkGuide.CFrame = TargetCHitbox;

    if (!canPlaceItem(State, HitBoxMarkGuide)) {
        Item.Transparency = 0.8;
        Item.Color = CBC.CANT_PLACE_COLOR;
    }
    else {
        Item.Transparency = 1;
    }

    State.CurrentTween = TweenService.Create(Item, CBC.TI, { CFrame: TargetCFrame });
    State.CurrentTween!.Play();
    State.CurrentTween!.Completed.Connect(() => {
        State.TweenIsMoving = false;
        State.CurrentTween = undefined;
    });
    State.TweenIsMoving = true;
}