import { BaseModule } from "@rbxgar/basemodule"

type BaseModuleMethods = Omit<BaseModule, "Declared">
type BaseModuleParams = Omit<BaseModule, "IsDestroyed" | "Destroy">