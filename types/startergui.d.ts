interface StarterGui extends BasePlayerGui {
	MainUI: ScreenGui & {
		Top: Frame & {
			UIListLayout: UIListLayout;
			["3_Currency"]: Frame & {
				UIListLayout: UIListLayout;
				["1_Money"]: Frame & {
					UICorner: UICorner;
					Container: Frame & {
						["2_MoneyText"]: Frame & {
							MoneyText: TextLabel & {
								UIStroke: UIStroke;
								UIGradient: UIGradient;
								Mantissa: NumberValue;
								Value: NumberValue;
								AddUIGradient: UIGradient;
								TakeUIGradient: UIGradient;
								Exponent: NumberValue;
							};
						};
						UIGradient: UIGradient;
						UIListLayout: UIListLayout;
						UIPadding: UIPadding;
						["1_CurrencyIcon"]: ImageLabel & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
							UIGradient: UIGradient;
						};
					};
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				["2_AltCurrency"]: Frame & {
					UICorner: UICorner;
					Container: Frame & {
						["2_MoneyText"]: Frame & {
							MoneyText: TextLabel & {
								UIGradient: UIGradient;
								Value: NumberValue;
								AddUIGradient: UIGradient;
								TakeUIGradient: UIGradient;
								UIStroke: UIStroke;
							};
						};
						UIGradient: UIGradient;
						UIListLayout: UIListLayout;
						UIPadding: UIPadding;
						["1_CurrencyIcon"]: ImageLabel & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
							UIGradient: UIGradient;
						};
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
		Left: Frame & {
			UIListLayout: UIListLayout;
			Actions: Frame & {
				["4_Settings"]: TextButton & {
					BG: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					Shadow: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIGradient: UIGradient;
					Sparkle: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					UICorner: UICorner;
					Page: ObjectValue;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Icon: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				["3_Shop"]: TextButton & {
					BG: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					Shadow: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIGradient: UIGradient;
					Sparkle: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					UICorner: UICorner;
					Page: ObjectValue;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Icon: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				UIListLayout: UIListLayout;
				["99_Debug"]: TextButton & {
					BG: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					Shadow: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIGradient: UIGradient;
					Sparkle: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					UICorner: UICorner;
					Page: ObjectValue;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Icon: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				["2_Inventory"]: TextButton & {
					Page: ObjectValue;
					Shadow: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIGradient: UIGradient;
					BG: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					UICorner: UICorner;
					Sparkle: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Icon: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				Level: TextButton & {
					FillSun: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					BorderOutline: Frame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					BG: Frame & {
						UICorner: UICorner;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					Border: Frame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					LevelText: TextLabel & {
						UIGradient: UIGradient;
						UIStroke: UIStroke;
					};
					Sun: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UIGradient: UIGradient;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Skyline: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					ExpandedInfo: Frame & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						LevelBarArea: Frame & {
							UIListLayout: UIListLayout;
							NextLevel: Frame & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
								Level: TextLabel & {
									UIGradient: UIGradient;
									UIStroke: UIStroke;
								};
							};
							BarArea: Frame & {
								LevelReward: Frame & {
									UIListLayout: UIListLayout;
									Text: TextLabel & {
										UIGradient: UIGradient;
										UIStroke: UIStroke;
									};
									Icon: ImageLabel & {
										UIAspectRatioConstraint: UIAspectRatioConstraint;
										UIGradient: UIGradient;
									};
								};
								EmptyBar: Frame & {
									UICorner: UICorner;
									ColorBar: Frame & {
										UICorner: UICorner;
										UIGradient: UIGradient;
									};
									Percentage: TextLabel & {
										UIGradient: UIGradient;
										UIStroke: UIStroke;
									};
								};
								MoneyToGo: TextLabel & {
									UIGradient: UIGradient;
									UIStroke: UIStroke;
								};
							};
							CurrentLevel: Frame & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
								Level: TextLabel & {
									UIGradient: UIGradient;
									UIStroke: UIStroke;
								};
							};
						};
					};
					SkylineOutline: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
				};
				["1_Build"]: TextButton & {
					Sparkle: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					Shadow: ImageButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIGradient: UIGradient;
					BG: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
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
				["00_Menu"]: Frame & {
					UICorner: UICorner;
					BG: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Sparkle: ImageLabel & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						UICorner: UICorner;
					};
				};
			};
		};
		MainFrame: Frame & {
			UIGradient: UIGradient;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			UICorner: UICorner;
			ScrollingBG: ImageLabel & {
				["MH-Cog-Padded"]: Decal;
				["MH-Bug-Padded"]: Decal;
				UICorner: UICorner;
				["MH-Boxes-Padded"]: Decal;
				["MH-Shop-Padded"]: Decal;
			};
			Content: Frame & {
				UIListLayout: UIListLayout;
				ScrollingFrame: ScrollingFrame & {
					Inventory: CanvasGroup & {
						Button: ObjectValue;
						Img: StringValue;
						Content: Frame & {
							UIListLayout: UIListLayout;
							ItemFrame: ScrollingFrame & {
								TemplateRow: Frame & {
									UIListLayout: UIListLayout;
									UIPadding: UIPadding;
									TemplateItem: TextButton & {
										UIPadding: UIPadding;
										Amount: TextLabel & {
											UIStroke: UIStroke;
											UIGradient: UIGradient;
											UIAspectRatioConstraint: UIAspectRatioConstraint;
										};
										UIStroke: UIStroke;
										UIAspectRatioConstraint: UIAspectRatioConstraint;
										Icon: ImageLabel & {
											UICorner: UICorner;
											UIStroke: UIStroke;
											UIAspectRatioConstraint: UIAspectRatioConstraint;
										};
									};
								};
								UIGridLayout: UIGridLayout;
								UIPadding: UIPadding;
							};
							Desc: Frame & {
								BG: CanvasGroup & {
									GridBG: ImageLabel;
									UIStroke: UIStroke & {
										UIGradient: UIGradient;
									};
									BG: ImageLabel;
									Sparkle: ImageLabel;
								};
								Container: Frame & {
									StatsFrame: Frame & {
										UICorner: UICorner;
										StatsFrame: ScrollingFrame & {
											UIListLayout: UIListLayout;
											Statistics: Frame & {
												UIListLayout: UIListLayout;
												Right: Frame & {
													UIListLayout: UIListLayout;
												};
												Left: Frame & {
													UIListLayout: UIListLayout;
												};
												StatEntry: Frame & {
													StatText: TextLabel & {
														UIGradient: UIGradient;
														UIStroke: UIStroke;
													};
													UIListLayout: UIListLayout;
													StatIcon: ImageButton & {
														UIAspectRatioConstraint: UIAspectRatioConstraint;
														Info: TextLabel & {
															UICorner: UICorner;
															UIStroke: UIStroke;
															UIGradient: UIGradient;
														};
													};
												};
											};
											Description: Frame & {
												DescText: TextLabel & {
													UIGradient: UIGradient;
													UIStroke: UIStroke;
												};
											};
											UIPadding: UIPadding;
										};
									};
									ItemName: TextLabel & {
										UIGradient: UIGradient;
										UIStroke: UIStroke;
									};
									UIPadding: UIPadding;
									IconContainer: Frame & {
										Icon: ImageLabel & {
											UICorner: UICorner;
											UIStroke: UIStroke;
											UIAspectRatioConstraint: UIAspectRatioConstraint;
										};
									};
									UIListLayout: UIListLayout;
									Buy: TextButton & {
										UICorner: UICorner;
									};
								};
							};
						};
					};
					Shop: CanvasGroup & {
						Button: ObjectValue;
						Img: StringValue;
						Content: Frame & {
							UIListLayout: UIListLayout;
							ItemFrame: ScrollingFrame & {
								TemplateRow: Frame & {
									UIListLayout: UIListLayout;
									UIPadding: UIPadding;
									TemplateItem: TextButton & {
										UIPadding: UIPadding;
										Amount: TextLabel & {
											UIStroke: UIStroke;
											UIGradient: UIGradient;
											UIAspectRatioConstraint: UIAspectRatioConstraint;
										};
										UIStroke: UIStroke;
										UIAspectRatioConstraint: UIAspectRatioConstraint;
										Icon: ImageLabel & {
											UICorner: UICorner;
											UIStroke: UIStroke;
											UIAspectRatioConstraint: UIAspectRatioConstraint;
										};
									};
								};
								UIGridLayout: UIGridLayout;
								UIPadding: UIPadding;
							};
							Desc: Frame & {
								BG: CanvasGroup & {
									GridBG: ImageLabel;
									UIStroke: UIStroke & {
										UIGradient: UIGradient;
									};
									BG: ImageLabel;
									Sparkle: ImageLabel;
								};
								Container: Frame & {
									StatsFrame: Frame & {
										UICorner: UICorner;
										StatsFrame: ScrollingFrame & {
											UIListLayout: UIListLayout;
											Statistics: Frame & {
												UIListLayout: UIListLayout;
												Right: Frame & {
													UIListLayout: UIListLayout;
												};
												Left: Frame & {
													UIListLayout: UIListLayout;
												};
												StatEntry: Frame & {
													StatText: TextLabel & {
														UIGradient: UIGradient;
														UIStroke: UIStroke;
													};
													UIListLayout: UIListLayout;
													StatIcon: ImageButton & {
														UIAspectRatioConstraint: UIAspectRatioConstraint;
														Info: TextLabel & {
															UICorner: UICorner;
															UIStroke: UIStroke;
															UIGradient: UIGradient;
														};
													};
												};
											};
											Description: Frame & {
												DescText: TextLabel & {
													UIGradient: UIGradient;
													UIStroke: UIStroke;
												};
											};
											UIPadding: UIPadding;
										};
									};
									ItemName: TextLabel & {
										UIGradient: UIGradient;
										UIStroke: UIStroke;
									};
									UIPadding: UIPadding;
									IconContainer: Frame & {
										Icon: ImageLabel & {
											UICorner: UICorner;
											UIStroke: UIStroke;
											UIAspectRatioConstraint: UIAspectRatioConstraint;
										};
									};
									UIListLayout: UIListLayout;
									Buy: TextButton & {
										UICorner: UICorner;
									};
								};
							};
						};
					};
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
					UIListLayout: UIListLayout;
					Settings: Frame & {
						Button: ObjectValue;
						Img: StringValue;
						Content: Frame & {
							TextLabel: TextLabel;
						};
					};
				};
				TopBar: Frame & {
					UICorner: UICorner;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					BarContent: Frame & {
						Sparkle: ImageLabel & {
							UICorner: UICorner;
							Title: TextLabel & {
								UIGradient: UIGradient;
								UIStroke: UIStroke;
							};
							UIPadding: UIPadding;
							Close: ImageButton & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
								UIGradient: UIGradient;
							};
						};
						BG: ImageLabel & {
							UICorner: UICorner;
						};
					};
				};
			};
			UIStroke: UIStroke;
		};
	};
	LoadingScreen: ScreenGui & {
		TS: Folder & {
			loading: LocalScript;
		};
		PauseEvery: NumberValue;
		Main: CanvasGroup & {
			BG: Frame & {
				Container: Frame & {
					FadeLevel: CanvasGroup & {
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
					};
					Logo: ImageLabel;
					FadeHint: CanvasGroup & {
						Hint: TextLabel & {
							UIGradient: UIGradient;
							UIStroke: UIStroke;
						};
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					PlayButton: CanvasGroup & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						Text: TextLabel & {
							UIGradient: UIGradient;
							UIStroke: UIStroke;
						};
						UIPadding: UIPadding;
						MainButton: ImageButton & {
							UICorner: UICorner;
							UIStroke: UIStroke & {
								UIGradient: UIGradient;
							};
						};
					};
				};
			};
			Blur: Frame & {
				BlurController: LocalScript;
			};
		};
	};
}
