type FastCastConstructor = new () => Caster;

interface FastCast {
	newBehavior(this: void): FastCastBehavior;
}

type FastCastScript = ModuleScript & {
    TypeMarshaller: ModuleScript;
    Table: ModuleScript;
    ActiveCast: ModuleScript;
    TypeDefinitions: ModuleScript;
    Signal: ModuleScript;
};

interface Caster {
	CastTerminating: RBXScriptSignal;
	LengthChanged: RBXScriptSignal;
	RayHit: RBXScriptSignal;
	RayPierced: RBXScriptSignal;
	WorldRoot: Workspace;

	Fire(
		origin: Vector3,
		direction: Vector3,
		velocity: Vector3 | number,
		FastCastBehavior?: FastCastBehavior,
	): ActiveCast;
}

//type CanPierceFunction = (ActiveCast, RaycastResult, Vector3) -> boolean
type CanPierceFunction = (arg0: ActiveCast, arg1: RaycastResult, arg2: Vector3) => boolean;

interface FastCastBehavior {
	Acceleration: Vector3;
	AutoIgnoreContainer: boolean;
	CanPierceFunction: CanPierceFunction;
	CosmeticBulletContainer?: Instance;
	CosmeticBulletProvier: unknown; //PartCache
	CosmeticBulletTemplate?: Instance;
	HighFidelityBehavior: number;
	HighFidelitySegmentSize: number;
	MaxDistance: number;
	RaycastParams?: RaycastParams;
}

interface CastTrajectory {
	Acceleration: Vector3;
	EndTime: number;
	InitalVelocity: Vector3;
	Origin: Vector3;
	StartTime: number;
}

interface CastStateInfo {
	CancelHighResCast: boolean;
	DistanceCovered: number;
	HighFidelityBehavior: number;
	HighFidelitySegmentSize: number;
	IsActivelyResimulating: boolean;
	IsActivelySimulatingPierce: boolean;
	Paused: boolean;
	TotalRuntime: number;
	Trajectories: CastTrajectory[];
	UpdateConnection: RBXScriptSignal;
}

interface CastRayInfo {
	CanPierceCallback: CanPierceFunction;
	CosmeticBulletObject?: Instance;
	MaxDistance: number;
	Paramters: RaycastParams;
	WorldRoot: Workspace;
}

interface ActiveCast {
	Caster: Caster;
	RayInfo: CastRayInfo;
	StateInfo: CastStateInfo;
	//UserData: {[any]: any}
}