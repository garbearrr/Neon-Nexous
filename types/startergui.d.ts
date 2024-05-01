interface StarterGui extends BasePlayerGui {
	Money: ScreenGui & {
		MoneyFrame: Frame & {
			MoneyText: TextLabel;
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
	InspectActions: ScreenGui & {
		Frame: Frame & {
			UIGridLayout: UIGridLayout;
			Move: TextButton;
			UICorner: UICorner;
			Sell: TextButton;
			Store: TextButton;
			None: TextButton;
		};
	};
}
