import { ReplicatedStorage } from "@rbxts/services"

export function InstatiateParticleEmitter<Emitter extends GuiObject, PartElement extends GuiObject>(hook: Emitter, particleElement: PartElement): PartEmitter<Emitter, PartElement> {
    const Module = require(ReplicatedStorage.WaitForChild("ParticleEmitter") as ModuleScript) as ParticleEmitterConstructor<Emitter, PartElement>;
    return new Module(hook, particleElement);
}