import { ReturnTypeBasedOnKey } from "../../../../types/util";
import { BaseModule } from "@rbxgar/basemodule";

interface ClientOreState {
    IsDestroyed: boolean;
    OreId: string;
    PhysicalOre: Part;
    Value: number;
}

interface ClientOreMethods {
    Get: <K extends keyof ClientOreState>(key: K) => Readonly<ReturnTypeBasedOnKey<ClientOreState, K>>;
    Process: (Add: number, Multiplier: number) => void;
    Upgrade: (Add: number, Multiplier: number, MinOreValue: number, MaxOreValue: number) => void;
}

interface ClientOreEvents {}

type ClientOreModule = BaseModule & ClientOreMethods & ClientOreEvents;