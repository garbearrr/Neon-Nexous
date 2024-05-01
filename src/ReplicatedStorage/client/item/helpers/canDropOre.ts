import { ClientDropperState } from "../types";

export const canDropOre = (State: ClientDropperState) => {
    const currentTime = tick();
    return (currentTime - State.LastDropTime) >= State.DropSpeed;
}