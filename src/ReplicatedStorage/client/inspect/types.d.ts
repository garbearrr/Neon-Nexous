import { FastCastConstructor, FastCastBehavior } from "@rbxgar/fastcast";
import { BaseModule } from "@rbxgar/basemodule";

interface ClientInspectState {
    CastBehavior:       FastCastBehavior;
    Caster:             InstanceType<FastCastConstructor>;
    CasterConnection?:  RBXScriptConnection;
    Enabled:            boolean;
    IsDestroyed:        boolean;
    MouseConnection?:   RBXScriptConnection;
    VRToolEquipped?:    "Put Away" | "Sell";
}

interface ClientInspectMethods {
    Disable: () => void;
    Enable: () => void;
    SetVRToolEquipped: (Tool?: "Put Away" | "Sell") => void;
    UpdateBehavior: () => void;
}

type ClientInspectModule = BaseModule & ClientInspectMethods; 