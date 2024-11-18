/**
 * ParticleEmitter Constructor
 * @param hook This is the UI element which the particle emitter will latch on to.
 * @param particleElement This is the UI element which will be used as the particle.
 */
type ParticleEmitterConstructor<Emitter extends GuiObject, PartElement extends GuiObject> = new (hook: Emitter, particalElement: PartElement) => PartEmitter<Emitter, PartElement>;

interface PartEmitter<Emitter extends GuiObject, PartElement extends GuiObject> {
    hook: Emitter;
    particles: Particle<PartElement>[];
    particleElement: PartElement;
    rate: number;

    onUpdate(particle: Particle<PartElement>, deltaTime: number): void;
    onSpawn(particle: Particle<PartElement>): void;

    /**
     * Destroy the particle emitter
     */
    Destroy(): void;
    /**
     * Emits particle(s) given a count
     */
    Emit(count: number): void;

}

interface Particle<PartElement extends GuiObject> {
    age: number;
    element: PartElement;
    isDead: boolean;
    maxAge: number;
    position: Vector2;
    ticks: number;
    velocity: Vector2;

    Destroy(): void;
    Update(deltaTime: number, onUpdate: (particle: Particle<PartElement>, deltaTime: number) => void): void;
}