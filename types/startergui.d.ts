interface StarterGui extends BasePlayerGui {
	MainUI: ScreenGui & {
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
		MainPadding: UIPadding;
		Level: TextButton & {
			FillSun: ImageLabel & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				UIGradient: UIGradient;
			};
			Sun: ImageLabel & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				UIGradient: UIGradient;
			};
			BorderOutline: Frame & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			Border: Frame & {
				UICorner: UICorner;
				UIStroke: UIStroke;
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			Skyline: ImageLabel & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			BG: Frame & {
				UICorner: UICorner;
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			SkylineOutline: ImageLabel & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
		};
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
										Amount: TextLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint;
											UIStroke: UIStroke;
										};
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
									UIListLayout: UIListLayout;
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
								};
							};
							List: Frame & {
								ScrollingFrame: ScrollingFrame & {
									UIListLayout: UIListLayout;
									TemplateButton: TextButton;
								};
								UICorner: UICorner;
							};
						};
					};
				};
			};
			UIStroke: UIStroke;
		};
	};
	LoadingScreen: ScreenGui & {
		BG: Frame & {
			Container: Frame & {
				Hint: TextLabel & {
					UIStroke: UIStroke;
				};
				Level: TextButton & {
					FillSun: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					Sun: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					Border: Frame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					BG: Frame & {
						UICorner: UICorner;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				Logo: ImageLabel;
			};
		};
		TS: Folder & {
			loading: LocalScript;
		};
	};
}
