interface Workspace extends Model {
	Items: Model & {
		Furnaces: Folder & {
			["20000"]: Part & {
				Stats: Folder & {
					ItemName: StringValue;
					Description: StringValue;
					Cost: StringValue;
					Multiplier: StringValue;
					MaxOreValue: StringValue;
					MinOreValue: StringValue;
					Add: StringValue;
					Icon: StringValue;
					ItemId: IntValue;
				};
				CollisionHitbox: Part & {
					SelectionBox: SelectionBox;
					WeldConstraint: WeldConstraint;
				};
				Model: Folder & {
					Base: Part & {
						WeldConstraint: WeldConstraint;
					};
					Frame: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
				};
				["Ore Processor"]: Folder;
				ClickDetector: ClickDetector;
				Receiver: Part & {
					ParticleEmitter: ParticleEmitter;
					PointLight: PointLight;
					Beam: Beam;
					WeldConstraint: WeldConstraint;
				};
			};
		};
		Platform: Part;
		Conveyors: Folder & {
			["30000"]: Part & {
				ConveyA1: Attachment;
				Stats: Folder & {
					ItemName: StringValue;
					Description: StringValue;
					Cost: StringValue;
					Speed: NumberValue;
					Icon: StringValue;
					ItemId: IntValue;
				};
				BeamA1: Attachment;
				DirectionIndicator: Beam & {
					["Conveyor Arrow"]: Decal;
				};
				ConveyA2: Attachment;
				CollisionHitbox: Part & {
					SelectionBox: SelectionBox;
					WeldConstraint: WeldConstraint;
				};
				Model: Folder & {
					Conveyor: Part & {
						WeldConstraint: WeldConstraint;
					};
					Front: Part & {
						WeldConstraint: WeldConstraint;
					};
					Sides: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
				};
				Conveyor: Folder;
				ClickDetector: ClickDetector;
				BeamA2: Attachment;
			};
		};
		Upgraders: Folder & {
			["40001"]: Part & {
				Conveyor: Part & {
					ConveyA1: Attachment;
					BeamA2: Attachment;
					DirectionIndicator: Beam & {
						["Conveyor Arrow"]: Decal;
					};
					Speed: NumberValue;
					BeamA1: Attachment;
					ConveyA2: Attachment;
					WeldConstraint: WeldConstraint;
				};
				ClickDetector: ClickDetector;
				Upgrade: Part & {
					WeldConstraint: WeldConstraint;
				};
				["Ore Gate"]: Folder;
				CollisionHitbox: Part & {
					SelectionBox: SelectionBox;
					WeldConstraint: WeldConstraint;
				};
				Model: Folder & {
					Conveyor: Folder & {
						Front: Part & {
							WeldConstraint: WeldConstraint;
						};
						Conveyor: Part & {
							WeldConstraint: WeldConstraint;
						};
					};
				};
				Button: Part & {
					WeldConstraint: WeldConstraint;
				};
				Gate: Part & {
					WeldConstraint: WeldConstraint;
				};
				Stats: Folder & {
					ItemName: StringValue;
					Description: StringValue;
					Cost: StringValue;
					Multiplier: NumberValue;
					MaxUpgrades: NumberValue;
					MinOreValue: NumberValue;
					MaxOreValue: NumberValue;
					ItemId: IntValue;
					Icon: StringValue;
					Add: NumberValue;
				};
			};
			["40000"]: Part & {
				Stats: Folder & {
					ItemName: StringValue;
					Description: StringValue;
					Cost: StringValue;
					Multiplier: NumberValue;
					MaxUpgrades: NumberValue;
					MinOreValue: StringValue;
					MaxOreValue: StringValue;
					ItemId: IntValue;
					Icon: StringValue;
					Add: StringValue;
				};
				CollisionHitbox: Part & {
					SelectionBox: SelectionBox;
					WeldConstraint: WeldConstraint;
				};
				Model: Folder & {
					UpgraderSupport: UnionOperation & {
						Beam: Beam;
						WeldConstraint: WeldConstraint;
					};
					NeonRing: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					NeonSupport: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Base: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Conveyor: Folder & {
						Front: Part & {
							WeldConstraint: WeldConstraint;
						};
						Conveyor: Part & {
							WeldConstraint: WeldConstraint;
						};
					};
				};
				["Erbium Infusor"]: Folder;
				ClickDetector: ClickDetector;
				Conveyor: Part & {
					ConveyA1: Attachment;
					BeamA2: Attachment;
					DirectionIndicator: Beam & {
						["Conveyor Arrow"]: Decal;
					};
					Speed: NumberValue;
					BeamA1: Attachment;
					ConveyA2: Attachment;
					WeldConstraint: WeldConstraint;
				};
				Upgrade: Part & {
					WeldConstraint: WeldConstraint;
				};
			};
		};
		SpawnLocation: SpawnLocation;
		Droppers: Folder & {
			["10000"]: Part & {
				["Erbium Mine"]: Folder;
				Stats: Folder & {
					ItemName: StringValue;
					Description: StringValue;
					OreValue: StringValue;
					Cost: StringValue;
					DropSpeed: NumberValue;
					Icon: StringValue;
					ItemId: IntValue;
				};
				CollisionHitbox: Part & {
					SelectionBox: SelectionBox;
					WeldConstraint: WeldConstraint;
				};
				Model: Folder & {
					TubeBack: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Cap: Part & {
						WeldConstraint: WeldConstraint;
					};
					Tubes: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					TubeFront: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Base: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Supports: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
				};
				Ore: Part & {
					WeldConstraint: WeldConstraint;
				};
				ClickDetector: ClickDetector;
				Drop: Attachment;
			};
			["10001"]: Part & {
				["Erbium Mine"]: Folder;
				Stats: Folder & {
					ItemName: StringValue;
					Description: StringValue;
					OreValue: StringValue;
					Cost: StringValue;
					DropSpeed: NumberValue;
					Icon: StringValue;
					ItemId: IntValue;
				};
				CollisionHitbox: Part & {
					SelectionBox: SelectionBox;
					WeldConstraint: WeldConstraint;
				};
				Model: Folder & {
					TubeBack: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Cap: Part & {
						WeldConstraint: WeldConstraint;
					};
					Tubes: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					TubeFront: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Base: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Supports: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
				};
				Ore: Part & {
					WeldConstraint: WeldConstraint;
				};
				ClickDetector: ClickDetector;
				Drop: Attachment;
			};
			["10002"]: Part & {
				["Erbium Mine"]: Folder;
				Stats: Folder & {
					ItemName: StringValue;
					Description: StringValue;
					OreValue: StringValue;
					Cost: StringValue;
					DropSpeed: NumberValue;
					Icon: StringValue;
					ItemId: IntValue;
				};
				CollisionHitbox: Part & {
					SelectionBox: SelectionBox;
					WeldConstraint: WeldConstraint;
				};
				Model: Folder & {
					TubeBack: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Cap: Part & {
						WeldConstraint: WeldConstraint;
					};
					Tubes: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					TubeFront: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Base: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
					Supports: UnionOperation & {
						WeldConstraint: WeldConstraint;
					};
				};
				Ore: Part & {
					WeldConstraint: WeldConstraint;
				};
				ClickDetector: ClickDetector;
				Drop: Attachment;
			};
		};
	};
	Camera: Camera;
	Environment: Folder & {
		AltShop: Model & {
			NeonCrystal: Model;
			Top: Model & {
				Top: Part;
			};
			Pillars: Model;
			Base: Model;
		};
		Islands: Folder & {
			Orbs: Model;
		};
		Pools: Model & {
			["Wall Pool"]: Model & {
				Underlight: Part & {
					SurfaceLight: SurfaceLight;
				};
				FloorPool: Part & {
					galaxytexturetest: Decal;
					Sparkles: Texture;
					ParticleEmitter: ParticleEmitter;
				};
			};
			SmallPool: Model & {
				Underlight: Part & {
					SurfaceLight: SurfaceLight;
				};
				FloorPool: Part & {
					galaxytexturetest: Decal;
					Sparkles: Texture;
					ParticleEmitter: ParticleEmitter;
				};
			};
			BigPool: Model & {
				Underlight: Part & {
					SurfaceLight: SurfaceLight;
				};
				FloorPool: Part & {
					galaxytexturetest: Decal;
					Sparkles: Texture;
					ParticleEmitter: ParticleEmitter;
				};
			};
			GridPool: Model & {
				Underlight: Part & {
					SurfaceLight: SurfaceLight;
				};
				FloorPool: Part & {
					galaxytexturetest: Decal;
					Sparkles: Texture;
					ParticleEmitter: ParticleEmitter;
					Grid: Texture;
				};
			};
		};
		Decor: Folder & {
			Microwave: UnionOperation & {
				Underlight: Part;
				Cyl: Part;
			};
			Trees: Model;
			SphereRelic: Model;
			Garbear: Model & {
				LeftLowerArm: MeshPart & {
					OriginalSize: Vector3Value;
					LeftLowerArmWrapTarget: WrapTarget;
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbow: Motor6D;
					AvatarPartScaleType: StringValue;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFoot: MeshPart & {
					LeftFootWrapTarget: WrapTarget;
					OriginalSize: Vector3Value;
					LeftAnkle: Motor6D;
					AvatarPartScaleType: StringValue;
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				["Body Colors"]: BodyColors;
				Shirt: Shirt;
				Pants: Pants;
				Mustache: Accessory & {
					Handle: MeshPart & {
						FaceFrontAttachment: Attachment & {
							OriginalPosition: Vector3Value;
						};
						AccessoryWeld: Weld;
						OriginalSize: Vector3Value;
						AvatarPartScaleType: StringValue;
					};
				};
				RightFoot: MeshPart & {
					RightFootWrapTarget: WrapTarget;
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightAnkle: Motor6D;
					RightFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					AvatarPartScaleType: StringValue;
				};
				LeftLowerLeg: MeshPart & {
					LeftKnee: Motor6D;
					OriginalSize: Vector3Value;
					LeftLowerLegWrapTarget: WrapTarget;
					AvatarPartScaleType: StringValue;
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LowerTorso: MeshPart & {
					LowerTorsoWrapTarget: WrapTarget;
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					AvatarPartScaleType: StringValue;
					RootRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Head: MeshPart & {
					HatAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					Head: WrapTarget;
					FaceFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					FaceControls: FaceControls;
					Neck: Motor6D;
					SurfaceAppearance: SurfaceAppearance;
					HairAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					AvatarPartScaleType: StringValue;
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					FaceCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				UpperTorso: MeshPart & {
					RightCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Waist: Motor6D;
					UpperTorsoWrapTarget: WrapTarget;
					OriginalSize: Vector3Value;
					AvatarPartScaleType: StringValue;
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightLowerLeg: MeshPart & {
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLegWrapTarget: WrapTarget;
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKnee: Motor6D;
					OriginalSize: Vector3Value;
					AvatarPartScaleType: StringValue;
				};
				RightUpperArm: MeshPart & {
					RightShoulder: Motor6D;
					RightUpperArmWrapTarget: WrapTarget;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					AvatarPartScaleType: StringValue;
				};
				LeftUpperArm: MeshPart & {
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftUpperArmWrapTarget: WrapTarget;
					LeftShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftShoulder: Motor6D;
					OriginalSize: Vector3Value;
					AvatarPartScaleType: StringValue;
				};
				RightLowerArm: MeshPart & {
					OriginalSize: Vector3Value;
					RightLowerArmWrapTarget: WrapTarget;
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightElbow: Motor6D;
					AvatarPartScaleType: StringValue;
				};
				LeftHand: MeshPart & {
					OriginalSize: Vector3Value;
					AvatarPartScaleType: StringValue;
					LeftWrist: Motor6D;
					LeftGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHandWrapTarget: WrapTarget;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftUpperLeg: MeshPart & {
					LeftUpperLegWrapTarget: WrapTarget;
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHip: Motor6D;
					OriginalSize: Vector3Value;
					AvatarPartScaleType: StringValue;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Humanoid: Humanoid & {
					BodyDepthScale: NumberValue;
					BodyHeightScale: NumberValue;
					BodyTypeScale: NumberValue;
					BodyProportionScale: NumberValue;
					Animator: Animator;
					BodyWidthScale: NumberValue;
					HumanoidDescription: HumanoidDescription;
					HeadScale: NumberValue;
				};
				["Accessory (Small Tall Hat Red Band)"]: Accessory & {
					Handle: MeshPart & {
						AccessoryWeld: Weld;
						HatAttachment: Attachment & {
							OriginalPosition: Vector3Value;
						};
						OriginalSize: Vector3Value;
						AvatarPartScaleType: StringValue;
					};
				};
				RightUpperLeg: MeshPart & {
					OriginalSize: Vector3Value;
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLegWrapTarget: WrapTarget;
					RightHip: Motor6D;
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					AvatarPartScaleType: StringValue;
				};
				RightHand: MeshPart & {
					RightGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWrist: Motor6D;
					AvatarPartScaleType: StringValue;
					RightHandWrapTarget: WrapTarget;
				};
			};
			NeonPillarSmall: Model & {
				Union: UnionOperation;
				Neon: Part;
				RoundedCubve: MeshPart & {
					Weld: Weld;
				};
			};
			TV: UnionOperation & {
				["Wall Pool"]: Model & {
					Underlight: Part & {
						SurfaceLight: SurfaceLight;
					};
					FloorPool: Part & {
						galaxytexturetest: Decal;
						Sparkles: Texture;
						ParticleEmitter: ParticleEmitter;
					};
				};
			};
			RockCrystal: Model & {
				["Rock Pile 1"]: MeshPart;
				SmallRock: UnionOperation;
			};
			Rocks: Model & {
				Rock3: Model;
				[" Large Rock Formation 3"]: UnionOperation;
			};
		};
		RoundRelic: Model & {
			Part: Part;
			Cyl: Part;
			Union: UnionOperation;
			SemiCircle: UnionOperation;
		};
		Base: Model & {
			Extension: Model;
		};
		Mountain: Model & {
			Stairs: Model & {
				Stairs8: Model & {
					Union: UnionOperation;
				};
			};
			Wedge: Part;
			Cyl: Part;
			["Med Rock Formation 2"]: UnionOperation;
			Rock3: Model & {
				Part: Part;
				Union: UnionOperation;
			};
		};
	};
	["pretty rbx demo"]: Sound;
	FallPart: Part;
	Plots: Folder & {
		["1"]: Folder & {
			PlacedItems: Folder;
			Ore: Folder;
			Anchors: Folder & {
				Template: Part & {
					SurfaceGui: SurfaceGui & {
						TextLabel: TextLabel;
					};
				};
			};
			Temp: Folder;
			DragGridPart: Part;
			BuildModulePlot: Part & {
				LightningStrike: Part & {
					LightningPart: ParticleEmitter;
				};
				CameraContainer: Part;
				BoltStart: Attachment;
				BoltEnd: Attachment;
				LightningBeam: Beam;
			};
		};
	};
}
