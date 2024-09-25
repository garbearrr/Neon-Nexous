interface StarterGui extends BasePlayerGui {
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
				ItemEntry: Frame & {
					PID: TextLabel;
					Dest: TextButton;
					UICorner: UICorner;
					ViewportFrame: ViewportFrame;
					ID: TextLabel;
				};
				UIPadding: UIPadding;
				UIGridLayout: UIGridLayout;
			};
			GeneralFrame: ScrollingFrame & {
				TogHixboxes: TextButton & {
					UICorner: UICorner;
				};
				UIGridLayout: UIGridLayout;
				UIPadding: UIPadding;
			};
			ItemsFrame: ScrollingFrame & {
				ItemEntry: Frame & {
					ID: TextLabel;
					ViewportFrame: ViewportFrame;
					UICorner: UICorner;
				};
				UIPadding: UIPadding;
				UIGridLayout: UIGridLayout;
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
	MainUI: ScreenGui & {
		MainPadding: UIPadding;
		Top: Frame & {
			UIListLayout: UIListLayout;
			["1_Message"]: Frame & {
				Message: Frame & {
					UICorner: UICorner;
					["2_MoneyText"]: TextLabel;
					UIGradient: UIGradient;
					UIPadding: UIPadding;
				};
			};
			["2_Actions"]: Frame & {
				["4_Settings"]: TextButton & {
					UICorner: UICorner;
					Settings: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
				};
				["00_Menu"]: Frame & {
					UICorner: UICorner;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				["3_Shop"]: TextButton & {
					UICorner: UICorner;
					Shop: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
				};
				["0_Expand"]: Frame & {
					UICorner: UICorner;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				UIListLayout: UIListLayout;
				["1_Build"]: TextButton & {
					UICorner: UICorner;
					UIGradient: UIGradient;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Build: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				Expand: LocalScript;
				["2_Inventory"]: TextButton & {
					UICorner: UICorner;
					Inv: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
				};
			};
			["3_Currency"]: Frame & {
				UIListLayout: UIListLayout;
				["1_Money"]: Frame & {
					["2_MoneyText"]: TextLabel & {
						Value: NumberValue;
						UIGradient: UIGradient;
					};
					UIGradient: UIGradient;
					UIListLayout: UIListLayout;
					UICorner: UICorner;
					UIPadding: UIPadding;
					["3_AddButton"]: TextButton & {
						UICorner: UICorner;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					["1_CurrencyIcon"]: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
				};
				UIPadding: UIPadding;
				["2_AltCurrency"]: Frame & {
					["2_MoneyText"]: TextLabel;
					UIGradient: UIGradient;
					UIListLayout: UIListLayout;
					UICorner: UICorner;
					UIPadding: UIPadding;
					["3_AddButton"]: TextButton & {
						UICorner: UICorner;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					["1_CurrencyIcon"]: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
				};
			};
		};
		Bottom: Frame & {
			Shop: Frame & {
				UIPadding: UIPadding;
				["3_Content"]: Frame & {
					UICorner: UICorner;
					Divider: Frame;
					ScrollingFrame: ScrollingFrame & {
						TemplateRow: Frame & {
							UIListLayout: UIListLayout;
							TemplateItem: Frame & {
								ViewportFrame: ViewportFrame & {
									Model: Model & {
										["10000"]: Part & {
											["Erbium Mine"]: Folder;
											Stats: Folder & {
												ItemName: StringValue;
												Cost: NumberValue;
												DropSpeed: NumberValue;
												OreValue: NumberValue;
												ItemId: IntValue;
											};
											ClickDetector: ClickDetector;
											Model: Folder & {
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
											Ore: Part & {
												WeldConstraint: WeldConstraint;
											};
											CollisionHitbox: Part & {
												WeldConstraint: WeldConstraint;
											};
											Drop: Attachment;
										};
									};
								};
								UIAspectRatioConstraint: UIAspectRatioConstraint;
								UICorner: UICorner;
							};
							UIPadding: UIPadding;
						};
						UIGridLayout: UIGridLayout;
					};
					UIGradient: UIGradient;
				};
				UIListLayout: UIListLayout;
				["1_Bar"]: Frame & {
					Divider: Frame;
					Bar: Frame & {
						UIGradient: UIGradient;
						["2_Close"]: TextButton & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
						UICorner: UICorner;
						["1_Title"]: TextLabel;
						UIListLayout: UIListLayout;
						UIPadding: UIPadding;
					};
				};
				UICorner: UICorner;
			};
		};
	};
	OldUI: ScreenGui & {
		MainPadding: UIPadding;
		Top: Frame & {
			["1_Message"]: Frame & {
				Message: Frame & {
					UICorner: UICorner;
					["2_MoneyText"]: TextLabel;
					UIGradient: UIGradient;
					UIPadding: UIPadding;
				};
			};
			["2_Actions"]: Frame & {
				["3_Shop"]: Frame & {
					Shop: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					UIGradient: UIGradient;
					UICorner: UICorner;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Expand: LocalScript;
				};
				["4_Settngs"]: Frame & {
					UIGradient: UIGradient;
					UICorner: UICorner;
					Expand: LocalScript;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Settings: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
				};
				UIListLayout: UIListLayout;
				["1_Build"]: Frame & {
					UIGradient: UIGradient;
					UICorner: UICorner;
					Expand: LocalScript;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Build: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
				};
				["2_Inventory"]: Frame & {
					Inv: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					UIGradient: UIGradient;
					UICorner: UICorner;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Expand: LocalScript;
				};
			};
			UIListLayout: UIListLayout;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			["3_Currency"]: Frame & {
				UIListLayout: UIListLayout;
				["1_Money"]: Frame & {
					["2_MoneyText"]: TextLabel;
					UIGradient: UIGradient;
					UIListLayout: UIListLayout;
					UICorner: UICorner;
					UIPadding: UIPadding;
					["3_AddButton"]: TextButton & {
						UICorner: UICorner;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					["1_CurrencyIcon"]: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
				};
				["2_AltCurrency"]: Frame & {
					["2_MoneyText"]: TextLabel;
					UIGradient: UIGradient;
					UIListLayout: UIListLayout;
					UICorner: UICorner;
					UIPadding: UIPadding;
					["3_AddButton"]: TextButton & {
						UICorner: UICorner;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					["1_CurrencyIcon"]: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
				};
			};
		};
		Bottom: Frame & {
			Shop: Frame & {
				UIListLayout: UIListLayout;
				["1_Bar"]: Frame & {
					["1_Title"]: TextLabel;
					["2_Close"]: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIListLayout: UIListLayout;
					UIPadding: UIPadding;
					UIGradient: UIGradient;
				};
				["2_Content"]: Frame & {
					UIGradient: UIGradient;
					ScrollingFrame: ScrollingFrame & {
						TemplateRow: Frame & {
							UIListLayout: UIListLayout;
							TemplateItem: Frame & {
								ViewportFrame: ViewportFrame & {
									Model: Model & {
										["10000"]: Part & {
											["Erbium Mine"]: Folder;
											Stats: Folder & {
												ItemName: StringValue;
												Cost: NumberValue;
												DropSpeed: NumberValue;
												OreValue: NumberValue;
												ItemId: IntValue;
											};
											ClickDetector: ClickDetector;
											Model: Folder & {
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
											Ore: Part & {
												WeldConstraint: WeldConstraint;
											};
											CollisionHitbox: Part & {
												WeldConstraint: WeldConstraint;
											};
											Drop: Attachment;
										};
									};
								};
								UIAspectRatioConstraint: UIAspectRatioConstraint;
								UICorner: UICorner;
							};
							UIPadding: UIPadding;
						};
						UIGridLayout: UIGridLayout;
					};
				};
			};
		};
	};
}
