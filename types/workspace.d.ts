interface Workspace extends Model {
	Items: Model & {
		Furnaces: Folder & {
			["20000"]: Part & {
				Stats: Folder & {
					ItemName: StringValue;
					Cost: NumberValue;
					Add: NumberValue;
					Multiplier: NumberValue;
					ItemId: IntValue;
					Icon: StringValue;
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
					Speed: NumberValue;
					ItemName: StringValue;
					ItemId: IntValue;
					Cost: NumberValue;
					Icon: StringValue;
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
					MaxOreValue: NumberValue;
					ItemName: StringValue;
					Cost: NumberValue;
					ItemId: IntValue;
					MinOreValue: NumberValue;
					Multiplier: NumberValue;
					Add: NumberValue;
				};
			};
			["40000"]: Part & {
				Stats: Folder & {
					MaxOreValue: NumberValue;
					ItemName: StringValue;
					Cost: NumberValue;
					ItemId: IntValue;
					MinOreValue: NumberValue;
					Multiplier: NumberValue;
					Add: NumberValue;
					Icon: StringValue;
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
		Droppers: Folder & {
			["10000"]: Part & {
				["Erbium Mine"]: Folder;
				Stats: Folder & {
					ItemName: StringValue;
					Cost: NumberValue;
					DropSpeed: NumberValue;
					OreValue: NumberValue;
					ItemId: IntValue;
					Icon: StringValue;
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
					Cost: NumberValue;
					DropSpeed: NumberValue;
					OreValue: NumberValue;
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
					Cost: NumberValue;
					DropSpeed: NumberValue;
					OreValue: NumberValue;
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
				CameraContainer: Part;
			};
		};
	};
	ItemImaging: Folder & {
		ItemImageLoc: Part & {
			WeldConstraint: WeldConstraint;
		};
		CamFollow: Part;
		PlayerStand: Part;
	};
	GuiPart: Part;
	Map: Model & {
		DesertedIsland: Model;
		VolcanoIsland: Model & {
			Volcano: Part & {
				PointLight: PointLight;
				Sparks: ParticleEmitter;
				Smoke: ParticleEmitter;
			};
			Folliage: Model;
		};
		Model: Model & {
			SavannaTree: Model;
		};
		AtollIsland: Model & {
			Folliage: Model;
		};
	};
	Grid: Decal;
}
