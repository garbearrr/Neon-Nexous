interface StarterGui extends BasePlayerGui {
	InvGUI: BillboardGui & {
		Frame: Frame & {
			Inventory: TextLabel;
			UIPadding: UIPadding;
			UpgraderViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["40000"]: Part & {
						Stats: Folder & {
							MaxOreValue: NumberValue;
							ItemName: StringValue;
							Cost: NumberValue;
							ItemId: IntValue;
							MinOreValue: NumberValue;
							Multiplier: NumberValue;
							Add: NumberValue;
						};
						CollisionHitbox: Part & {
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
			};
			UICorner: UICorner;
			PlaceButton: TextButton & {
				UICorner: UICorner;
				Frame: Frame;
			};
			ConveyorViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["30000"]: Part & {
						ConveyA1: Attachment;
						Stats: Folder & {
							Speed: NumberValue;
							ItemName: StringValue;
							ItemId: IntValue;
							Cost: NumberValue;
						};
						BeamA1: Attachment;
						DirectionIndicator: Beam & {
							["Conveyor Arrow"]: Decal;
						};
						ConveyA2: Attachment;
						CollisionHitbox: Part & {
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
						ClickDetector: ClickDetector;
						BeamA2: Attachment;
					};
				};
			};
			FurnaceViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["20000"]: Part & {
						Stats: Folder & {
							ItemName: StringValue;
							Cost: NumberValue;
							Add: NumberValue;
							Multiplier: NumberValue;
							ItemId: IntValue;
						};
						CollisionHitbox: Part & {
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
						ClickDetector: ClickDetector;
						Receiver: Part & {
							ParticleEmitter: ParticleEmitter;
							Beam: Beam;
							WeldConstraint: WeldConstraint;
						};
					};
				};
			};
			Item: Frame & {
				ItemName: TextLabel;
				Left: TextLabel;
				Right: TextLabel;
			};
			Category: Frame & {
				Right: TextLabel;
				Left: TextLabel;
				CategoryName: TextLabel;
			};
			GateViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["40001"]: Part & {
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
						CollisionHitbox: Part & {
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
			};
			DropperViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["10000"]: Model & {
						TubeBack: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						Cap: Part & {
							WeldConstraint: WeldConstraint;
						};
						Supports: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						Tubes: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						Base: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						TubeFront: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
					};
				};
			};
		};
	};
	Shop: ScreenGui & {
		ShopFrame: Frame & {
			Items: ScrollingFrame & {
				ExampleFrame: ViewportFrame & {
					UICorner: UICorner;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Model: Model & {
						TubeBack: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						Cap: Part & {
							WeldConstraint: WeldConstraint;
						};
						Supports: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						Tubes: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						Base: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						TubeFront: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
					};
				};
				UIPadding: UIPadding;
				UIGridLayout: UIGridLayout;
			};
			TabsMaster: Frame & {
				Tabs: Frame & {
					Furnaces: ImageButton & {
						UICorner: UICorner;
					};
					UIGridLayout: UIGridLayout;
					Conveyors: ImageButton & {
						UICorner: UICorner;
					};
					Upgraders: ImageButton & {
						UICorner: UICorner;
					};
					ImageButton: ImageButton & {
						UICorner: UICorner;
					};
					Droppers: ImageButton & {
						UICorner: UICorner;
					};
				};
				UIPadding: UIPadding;
			};
			UIListLayout: UIListLayout;
			UISizeConstraint: UISizeConstraint;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			Textboxes: Frame & {
				Password: TextBox & {
					UICorner: UICorner;
				};
				UIGridLayout: UIGridLayout;
				Search: TextBox & {
					UICorner: UICorner;
				};
				UIPadding: UIPadding;
			};
		};
	};
	Money: ScreenGui & {
		MoneyFrame: Frame & {
			UIDragDetector: UIDragDetector;
			MoneyText: TextLabel;
		};
	};
	ClientDebug: ScreenGui & {
		ItemModule: Frame & {
			ActionFrame: Frame & {
				Items: TextButton;
				General: TextButton;
				UIListLayout: UIListLayout;
				Inventory: TextButton;
				Placed: TextButton;
			};
			Close: TextButton & {
				CloseButton: LocalScript;
			};
			PlacedFrame: ScrollingFrame & {
				UIListLayout: UIListLayout;
				ItemEntry: Frame & {
					UICorner: UICorner;
					ID: TextLabel;
					PID: TextLabel;
					ViewportFrame: ViewportFrame;
					Dest: TextButton;
				};
				UIPadding: UIPadding;
			};
			GeneralFrame: ScrollingFrame & {
				UIListLayout: UIListLayout;
				UIPadding: UIPadding;
				TogHixboxes: TextButton & {
					UICorner: UICorner;
				};
			};
			ItemsFrame: ScrollingFrame & {
				UIListLayout: UIListLayout;
				ItemEntry: Frame & {
					ID: TextLabel;
					ViewportFrame: ViewportFrame;
					UICorner: UICorner;
				};
				UIPadding: UIPadding;
			};
		};
		InputModule: Frame & {
			Label: TextLabel;
			UIDragDetector: UIDragDetector;
			Close: TextButton & {
				CloseButton: LocalScript;
			};
			List: ScrollingFrame & {
				Entry: Frame & {
					ID: TextBox;
					Flags: TextBox;
					Key: TextBox;
					Unbind: TextButton;
				};
				UIListLayout: UIListLayout;
			};
		};
		Main: ScrollingFrame & {
			UIListLayout: UIListLayout;
			Entry: TextButton & {
				UICorner: UICorner;
			};
		};
		CamModule: Frame & {
			Label: TextLabel;
			UIDragDetector: UIDragDetector;
			Close: TextButton & {
				CloseButton: LocalScript;
			};
			List: ScrollingFrame & {
				LockLookDirections: Frame & {
					["1"]: TextButton;
					Setting: TextLabel;
					["3"]: TextButton;
					["2"]: TextButton;
					UIListLayout: UIListLayout;
					["0"]: TextButton;
				};
				SetKeyRotationSpeed: Frame & {
					Slider: Frame & {
						Value: TextBox;
						Bar: Frame & {
							Dragger: TextLabel & {
								UIDragDetector: UIDragDetector;
							};
						};
					};
					Setting: TextLabel;
				};
				SetRotationSpeed: Frame & {
					Slider: Frame & {
						Value: TextBox;
						Bar: Frame & {
							Dragger: TextLabel & {
								UIDragDetector: UIDragDetector;
							};
						};
					};
					Setting: TextLabel;
				};
				SetLookVectors: Frame & {
					["1"]: TextButton;
					["0"]: TextButton;
					["2"]: TextButton;
					UIListLayout: UIListLayout;
					Setting: TextLabel;
				};
				LockMoveDirections: Frame & {
					["1"]: TextButton;
					Setting: TextLabel;
					["3"]: TextButton;
					["2"]: TextButton;
					UIListLayout: UIListLayout;
					["0"]: TextButton;
				};
				SetCameraSpeed: Frame & {
					Slider: Frame & {
						Value: TextBox;
						Bar: Frame & {
							Dragger: TextLabel & {
								UIDragDetector: UIDragDetector;
							};
						};
					};
					Setting: TextLabel;
				};
				SetScrollSmoothness: Frame & {
					Slider: Frame & {
						Value: TextBox;
						Bar: Frame & {
							Dragger: TextLabel & {
								UIDragDetector: UIDragDetector;
							};
						};
					};
					Setting: TextLabel;
				};
				InvertCamUpDown: Frame & {
					Checkbox: TextButton;
					Setting: TextLabel;
				};
				LockZoomDirections: Frame & {
					UIListLayout: UIListLayout;
					Setting: TextLabel;
					["1"]: TextButton;
					["0"]: TextButton;
				};
				UIListLayout: UIListLayout;
				SetScrollSpeed: Frame & {
					Slider: Frame & {
						Value: TextBox;
						Bar: Frame & {
							Dragger: TextLabel & {
								UIDragDetector: UIDragDetector;
							};
						};
					};
					Setting: TextLabel;
				};
				["Control Settings"]: TextLabel & {
					refresh: TextButton;
				};
				ShowContainer: Frame & {
					Checkbox: TextButton;
					Setting: TextLabel;
				};
				SetContainerDisregard: Frame & {
					Checkbox: TextButton;
					Setting: TextLabel;
				};
				SetRotationSmoothness: Frame & {
					Slider: Frame & {
						Value: TextBox;
						Bar: Frame & {
							Dragger: TextLabel & {
								UIDragDetector: UIDragDetector;
							};
						};
					};
					Setting: TextLabel;
				};
				FlipMouse: Frame & {
					Checkbox: TextButton;
					Setting: TextLabel;
				};
				InvertCamLeftRight: Frame & {
					Checkbox: TextButton;
					Setting: TextLabel;
				};
				SetKeyScrollSpeed: Frame & {
					Slider: Frame & {
						Value: TextBox;
						Bar: Frame & {
							Dragger: TextLabel & {
								UIDragDetector: UIDragDetector;
							};
						};
					};
					Setting: TextLabel;
				};
			};
		};
	};
	ShopGUI: BillboardGui & {
		Frame: Frame & {
			UIPadding: UIPadding;
			UpgraderViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["40000"]: Part & {
						Stats: Folder & {
							MaxOreValue: NumberValue;
							ItemName: StringValue;
							Cost: NumberValue;
							ItemId: IntValue;
							MinOreValue: NumberValue;
							Multiplier: NumberValue;
							Add: NumberValue;
						};
						CollisionHitbox: Part & {
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
			};
			Money: TextLabel;
			ConveyorViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["30000"]: Part & {
						ConveyA1: Attachment;
						Stats: Folder & {
							Speed: NumberValue;
							ItemName: StringValue;
							ItemId: IntValue;
							Cost: NumberValue;
						};
						BeamA1: Attachment;
						DirectionIndicator: Beam & {
							["Conveyor Arrow"]: Decal;
						};
						ConveyA2: Attachment;
						CollisionHitbox: Part & {
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
						ClickDetector: ClickDetector;
						BeamA2: Attachment;
					};
				};
			};
			FurnaceViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["20000"]: Part & {
						Stats: Folder & {
							ItemName: StringValue;
							Cost: NumberValue;
							Add: NumberValue;
							Multiplier: NumberValue;
							ItemId: IntValue;
						};
						CollisionHitbox: Part & {
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
						ClickDetector: ClickDetector;
						Receiver: Part & {
							ParticleEmitter: ParticleEmitter;
							Beam: Beam;
							WeldConstraint: WeldConstraint;
						};
					};
				};
			};
			Item: Frame & {
				ItemName: TextLabel;
				Left: TextLabel;
				Right: TextLabel;
			};
			DropperViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["10000"]: Model & {
						TubeBack: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						Cap: Part & {
							WeldConstraint: WeldConstraint;
						};
						Supports: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						Tubes: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						Base: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
						TubeFront: UnionOperation & {
							WeldConstraint: WeldConstraint;
						};
					};
				};
			};
			GateViewport: Frame & {
				ViewportFrame: ViewportFrame & {
					["40001"]: Part & {
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
						CollisionHitbox: Part & {
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
			};
			UICorner: UICorner;
			BuyButton: TextButton & {
				UICorner: UICorner;
				Frame: Frame;
			};
			Category: Frame & {
				Right: TextLabel;
				Left: TextLabel;
				CategoryName: TextLabel;
			};
		};
	};
	InspectActions: ScreenGui & {
		ItemName: TextLabel;
		Frame: Frame & {
			UIGridLayout: UIGridLayout;
			Move: TextButton;
			UICorner: UICorner;
			Sell: TextButton;
			Store: TextButton;
			Cancel: TextButton;
		};
	};
}
