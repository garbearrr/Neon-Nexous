import { BaseClientItemModule } from "ReplicatedStorage/client/item/types";
import { ClientBuildState } from "../types";
import { CBC } from "../constants";

const doBoxesOverlap = (Placed: Part, New: Part, offset=false): boolean => {
	const boxAMin = Placed.Position.add(
		new Vector3(0, offset ? CBC.COLLISION_CHECK_Y_OFFSET : 0, 0)
	).sub(Placed.Size.mul(0.5));
	const boxAMax = Placed.Position.add(
		new Vector3(0, offset ? CBC.COLLISION_CHECK_Y_OFFSET : 0, 0)
	).add(Placed.Size.mul(0.5));
	const boxBMin = New.Position.sub(New.Size.mul(0.5));
	const boxBMax = New.Position.add(New.Size.mul(0.5));

	return (
		boxAMax.X > boxBMin.X &&
		boxAMin.X < boxBMax.X &&
		boxAMax.Y > boxBMin.Y &&
		boxAMin.Y < boxBMax.Y &&
		boxAMax.Z > boxBMin.Z &&
		boxAMin.Z < boxBMax.Z
	);
}

export const canPlaceItem = (State: ClientBuildState, ItemCollisionHitbox: Part, offset=false): boolean => {
	for (const PlacedItem of _G.ItemPlaceCache.Values()) {
		print(PlacedItem);
		const PlacedCast = PlacedItem as BaseClientItemModule;
		const PlacedHitbox = PlacedCast.Get("PhysicalItem").CollisionHitbox;

		if (doBoxesOverlap(PlacedHitbox, ItemCollisionHitbox, offset))
			return false; // Item overlaps with an existing item.
	}

	return true;
}