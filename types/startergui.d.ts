interface StarterGui extends BasePlayerGui {
	["3DPages"]: Folder;
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
	ThreeDUI: SurfaceGui & {
		UIPadding: UIPadding;
		MainFrame: Frame & {
			UICorner: UICorner;
			UIStroke: UIStroke;
			Scanlines: ImageLabel & {
				UICorner: UICorner;
				Shop: Frame & {
					["1_TopBar"]: Frame & {
						UIListLayout: UIListLayout;
						X_Close: TextButton & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
						Title: TextLabel;
						UIPadding: UIPadding;
					};
					UICorner: UICorner;
					["3_Content"]: Frame & {
						UIListLayout: UIListLayout;
						["3_Desc"]: Frame & {
							["2_Name"]: TextLabel;
							["1_ItemImg"]: TextButton & {
								UIPadding: UIPadding;
								UIStroke: UIStroke;
								UIAspectRatioConstraint: UIAspectRatioConstraint;
								ImageButton: ImageButton & {
									UIAspectRatioConstraint: UIAspectRatioConstraint;
								};
							};
							["3_Buy"]: TextButton;
							UIPadding: UIPadding;
							UIListLayout: UIListLayout;
						};
						["1_ItemFrame"]: ScrollingFrame & {
							TemplateRow: Frame & {
								UIListLayout: UIListLayout;
								UIPadding: UIPadding;
								TemplateItem: TextButton & {
									UIPadding: UIPadding;
									UIStroke: UIStroke;
									UIAspectRatioConstraint: UIAspectRatioConstraint;
									ImageButton: ImageButton & {
										UIAspectRatioConstraint: UIAspectRatioConstraint;
									};
								};
							};
							UIGridLayout: UIGridLayout;
							UIPadding: UIPadding;
						};
						["2_Divider"]: Frame;
					};
					UIListLayout: UIListLayout;
					["2_Divider"]: Frame;
				};
				Settings: Frame & {
					["1_TopBar"]: Frame & {
						UIListLayout: UIListLayout;
						X_Close: TextButton & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
						UIPadding: UIPadding;
						Title: TextLabel;
					};
					UICorner: UICorner;
					UIListLayout: UIListLayout;
					["3_Content"]: Frame;
					["2_Divider"]: Frame;
				};
				Inventory: Frame & {
					["1_TopBar"]: Frame & {
						UIListLayout: UIListLayout;
						X_Close: TextButton & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
						Title: TextLabel;
						UIPadding: UIPadding;
					};
					UICorner: UICorner;
					["3_Content"]: Frame & {
						UIListLayout: UIListLayout;
						["3_Desc"]: Frame & {
							["2_Name"]: TextLabel;
							["1_ItemImg"]: TextButton & {
								UIPadding: UIPadding;
								UIStroke: UIStroke;
								UIAspectRatioConstraint: UIAspectRatioConstraint;
								ImageButton: ImageButton & {
									UIAspectRatioConstraint: UIAspectRatioConstraint;
								};
							};
							["3_Buy"]: TextButton;
							UIPadding: UIPadding;
							UIListLayout: UIListLayout;
						};
						["1_ItemFrame"]: ScrollingFrame & {
							TemplateRow: Frame & {
								UIListLayout: UIListLayout;
								UIPadding: UIPadding;
								TemplateItem: TextButton & {
									UIPadding: UIPadding;
									UIStroke: UIStroke;
									UIAspectRatioConstraint: UIAspectRatioConstraint;
									ImageButton: ImageButton & {
										UIAspectRatioConstraint: UIAspectRatioConstraint;
									};
								};
							};
							UIGridLayout: UIGridLayout;
							UIPadding: UIPadding;
						};
						["2_Divider"]: Frame;
					};
					UIListLayout: UIListLayout;
					["2_Divider"]: Frame;
				};
			};
		};
	};
	MainUI: ScreenGui & {
		MainPadding: UIPadding;
		MainFrame: Frame & {
			UIGradient: UIGradient;
			UICorner: UICorner;
			ScrollingBG: ImageLabel & {
				["MH-Cog-Padded"]: Decal;
				["MH-Bug-Padded"]: Decal;
				UICorner: UICorner;
				["MH-Boxes-Padded"]: Decal;
				["MH-Shop-Padded"]: Decal;
			};
			Content: Frame & {
				TopBar: Frame & {
					UICorner: UICorner;
					FillBotCorners: Frame & {
						Title: TextLabel;
						UIPadding: UIPadding;
						Close: ImageButton & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
					};
				};
				ScrollingFrame: ScrollingFrame & {
					Inventory: Frame & {
						Button: ObjectValue;
						Img: StringValue;
						Content: Frame & {
							UIListLayout: UIListLayout;
							Desc: Frame & {
								["2_Name"]: TextLabel;
								["1_ItemImg"]: TextButton & {
									UIPadding: UIPadding;
									UIStroke: UIStroke;
									UIAspectRatioConstraint: UIAspectRatioConstraint;
									ImageButton: ImageButton & {
										UICorner: UICorner;
										UIStroke: UIStroke;
										UIAspectRatioConstraint: UIAspectRatioConstraint;
									};
								};
								["3_Buy"]: TextButton & {
									UICorner: UICorner;
								};
								UIPadding: UIPadding;
								UIListLayout: UIListLayout;
							};
							Divider: Frame;
							ItemFrame: ScrollingFrame & {
								TemplateRow: Frame & {
									UIListLayout: UIListLayout;
									UIPadding: UIPadding;
									TemplateItem: TextButton & {
										UIPadding: UIPadding;
										UIStroke: UIStroke;
										UIAspectRatioConstraint: UIAspectRatioConstraint;
										ImageButton: ImageButton & {
											UICorner: UICorner;
											UIStroke: UIStroke;
											UIAspectRatioConstraint: UIAspectRatioConstraint;
										};
										Amount: TextLabel;
									};
								};
								UIGridLayout: UIGridLayout;
								UIPadding: UIPadding;
							};
						};
					};
					Shop: Frame & {
						Button: ObjectValue;
						Img: StringValue;
						Content: Frame & {
							UIListLayout: UIListLayout;
							Desc: Frame & {
								["2_Name"]: TextLabel;
								UIPadding: UIPadding;
								UIListLayout: UIListLayout;
								["3_Buy"]: TextButton & {
									UICorner: UICorner;
								};
								["1_ItemImg"]: TextButton & {
									UIPadding: UIPadding;
									UIStroke: UIStroke;
									UIAspectRatioConstraint: UIAspectRatioConstraint;
									ImageButton: ImageButton & {
										UICorner: UICorner;
										UIStroke: UIStroke;
										UIAspectRatioConstraint: UIAspectRatioConstraint;
									};
								};
							};
							Divider: Frame;
							ItemFrame: ScrollingFrame & {
								TemplateRow: Frame & {
									UIListLayout: UIListLayout;
									UIPadding: UIPadding;
									TemplateItem: TextButton & {
										UIPadding: UIPadding;
										UIStroke: UIStroke;
										UIAspectRatioConstraint: UIAspectRatioConstraint;
										ImageButton: ImageButton & {
											UICorner: UICorner;
											UIStroke: UIStroke;
											UIAspectRatioConstraint: UIAspectRatioConstraint;
										};
									};
								};
								UIGridLayout: UIGridLayout;
								UIPadding: UIPadding;
							};
						};
					};
					Settings: Frame & {
						Button: ObjectValue;
						Img: StringValue;
						Content: Frame & {
							TextLabel: TextLabel;
						};
					};
					UIListLayout: UIListLayout;
					Debug: Frame & {
						Button: ObjectValue;
						Img: StringValue;
						Content: Frame & {
							SettingsFrame: Frame & {
								ScrollingFrame: ScrollingFrame & {
									TemplateMultiButton: Frame & {
										ButtonArea: Frame & {
											UIListLayout: UIListLayout;
											TemplateButton: TextButton & {
												UICorner: UICorner;
											};
											UIPadding: UIPadding;
										};
										UIPadding: UIPadding;
										TextArea: Frame & {
											UIListLayout: UIListLayout;
											Update: TextButton & {
												UIAspectRatioConstraint: UIAspectRatioConstraint;
											};
											Info: TextLabel;
											Desc: TextLabel;
										};
									};
									TemplateMultiToggle: Frame & {
										ButtonArea: Frame & {
											UIListLayout: UIListLayout;
											TemplateButton: TextButton & {
												UICorner: UICorner;
											};
											UIPadding: UIPadding;
										};
										UIPadding: UIPadding;
										TextArea: Frame & {
											UIListLayout: UIListLayout;
											Update: TextButton & {
												UIAspectRatioConstraint: UIAspectRatioConstraint;
											};
											Info: TextLabel;
											Desc: TextLabel;
										};
									};
									TemplateDragBar: Frame & {
										TextArea: Frame & {
											UIListLayout: UIListLayout;
											Update: TextButton & {
												UIAspectRatioConstraint: UIAspectRatioConstraint;
											};
											Desc: TextLabel;
										};
										DragBar: Frame & {
											TextButton: TextButton;
											Under: Frame;
											Dec: ImageButton & {
												UIAspectRatioConstraint: UIAspectRatioConstraint;
												LowerBound: TextLabel;
											};
											ManualEntry: TextBox;
											Inc: ImageButton & {
												UIAspectRatioConstraint: UIAspectRatioConstraint;
												UpperBound: TextLabel;
											};
											Bar: Frame & {
												Handle: TextLabel & {
													UIAspectRatioConstraint: UIAspectRatioConstraint;
													UIDragDetector: UIDragDetector;
												};
												UIGradient: UIGradient;
											};
										};
										UIPadding: UIPadding;
									};
									UIListLayout: UIListLayout;
								};
							};
							List: Frame & {
								ScrollingFrame: ScrollingFrame & {
									TemplateButton: TextButton;
									UIListLayout: UIListLayout;
								};
								UICorner: UICorner;
							};
						};
					};
				};
			};
			UIStroke: UIStroke;
		};
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
				["00_Menu"]: Frame & {
					UICorner: UICorner;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				["3_Shop"]: TextButton & {
					UIGradient: UIGradient;
					UICorner: UICorner;
					Page: ObjectValue;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Icon: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				UIListLayout: UIListLayout;
				Expand: LocalScript;
				["2_Inventory"]: TextButton & {
					UIGradient: UIGradient;
					UICorner: UICorner;
					Page: ObjectValue;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Icon: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				["99_Debug"]: TextButton & {
					UIGradient: UIGradient;
					UICorner: UICorner;
					Page: ObjectValue;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Icon: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				["1_Build"]: TextButton & {
					UIGradient: UIGradient;
					UICorner: UICorner;
					Page: ObjectValue;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Icon: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				["0_Expand"]: Frame & {
					UICorner: UICorner;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				["4_Settings"]: TextButton & {
					UIGradient: UIGradient;
					UICorner: UICorner;
					Page: ObjectValue;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Icon: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
			};
			["3_Currency"]: Frame & {
				UIListLayout: UIListLayout;
				["1_Money"]: Frame & {
					["2_MoneyText"]: TextLabel & {
						Value: NumberValue;
						AddUIGradient: UIGradient;
						TakeUIGradient: UIGradient;
					};
					UIGradient: UIGradient;
					UIListLayout: UIListLayout;
					UICorner: UICorner;
					UIPadding: UIPadding;
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
					["1_CurrencyIcon"]: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
				};
			};
		};
		Bottom: Frame & {
			Inventory: Frame & {
				VisXVal: NumberValue;
				UIPadding: UIPadding;
				NotVisXVal: NumberValue;
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
						UIPadding: UIPadding;
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
			Shop: Frame & {
				VisXVal: NumberValue;
				UIPadding: UIPadding;
				NotVisXVal: NumberValue;
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
						UIPadding: UIPadding;
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
			ItemActionInfo: Frame & {
				UIPadding: UIPadding;
				UIListLayout: UIListLayout;
				UICorner: UICorner;
				Info: Frame & {
					UIListLayout: UIListLayout;
					ItemName: TextLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					Actions: Frame & {
						UIGridLayout: UIGridLayout;
						Move: TextButton & {
							UIPadding: UIPadding;
							ActionText: TextLabel;
							UICorner: UICorner;
							ActionIcon: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
							UIListLayout: UIListLayout;
						};
						Sell: TextButton & {
							UIPadding: UIPadding;
							ActionText: TextLabel;
							UICorner: UICorner;
							ActionIcon: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
							UIListLayout: UIListLayout;
						};
						Store: TextButton & {
							UIPadding: UIPadding;
							ActionText: TextLabel;
							UICorner: UICorner;
							ActionIcon: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
							UIListLayout: UIListLayout;
						};
						Buy: TextButton & {
							UIPadding: UIPadding;
							ActionText: TextLabel;
							UICorner: UICorner;
							ActionIcon: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
							UIListLayout: UIListLayout;
						};
					};
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				ItemIcon: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStroke: UIStroke;
				};
			};
		};
	};
	Base3D: SurfaceGui & {
		UIPadding: UIPadding;
		MainFrame: Frame & {
			ContentFrame: Frame;
			UIGradient: UIGradient;
			UIListLayout: UIListLayout;
			UICorner: UICorner;
			UIStroke: UIStroke;
			TopBar: Frame;
			Divider: Frame;
		};
	};
}
