interface ReplicatedStorage extends Instance {
	FastCastRedux: ModuleScript & {
		TypeMarshaller: ModuleScript;
		Table: ModuleScript;
		ActiveCast: ModuleScript;
		TypeDefinitions: ModuleScript;
		Signal: ModuleScript;
	};
	TS: Folder & {
		modules: Folder & {
			logging: ModuleScript & {
				methods: Folder & {
					warn: ModuleScript;
				};
			};
			grid: Folder & {
				methods: ModuleScript & {
					setGridSize: ModuleScript;
					setGridTexture: ModuleScript;
					toggleGrid: ModuleScript;
					setCellSize: ModuleScript;
				};
				grid: ModuleScript;
				helpers: Folder & {
					configureExtensionPart: ModuleScript;
					configureGridTexture: ModuleScript;
				};
				constants: ModuleScript;
			};
			build: Folder & {
				methods: ModuleScript & {
					placeInputEnd: ModuleScript;
					dragLock: ModuleScript;
					rotate: ModuleScript;
					enable: ModuleScript;
					placeInputBegin: ModuleScript;
				};
				constants: ModuleScript;
				helpers: ModuleScript & {
					fireCast: ModuleScript;
					getTopLeftGridXY: ModuleScript;
					getGridSizeXY: ModuleScript;
					getCellSkipAndCellOffset: ModuleScript;
					getItemSizeInCellsXY: ModuleScript;
					onRayHit: ModuleScript;
					configureCastBehavior: ModuleScript;
				};
				build: ModuleScript;
			};
		};
		client: Folder & {
			inventory: Folder & {
				addItem: ModuleScript;
				removeItem: ModuleScript;
			};
			item: Folder & {
				upgrader: ModuleScript;
				conveyor: ModuleScript;
				constants: ModuleScript;
				methods: Folder & {
					upgrader: ModuleScript & {
						onPlaced: ModuleScript;
						onSetup: ModuleScript;
					};
					conveyor: ModuleScript & {
						onSetup: ModuleScript;
						onPlaced: ModuleScript;
					};
					furnace: Folder & {
						onPlace: ModuleScript;
					};
					dropper: Folder & {
						drop: ModuleScript;
					};
				};
				furnace: ModuleScript;
				helpers: ModuleScript & {
					canDropOre: ModuleScript;
					itemModMap: ModuleScript;
					activateConveyor: ModuleScript;
				};
				dropper: ModuleScript;
			};
			inspect: Folder & {
				onMouseHoverLeave: ModuleScript;
				onMouseHoverEnter: ModuleScript;
				inspect: ModuleScript;
				helpers: Folder & {
					inspectOnRayHit: ModuleScript;
					inspectConnectMouse: ModuleScript;
				};
				methods: ModuleScript & {
					updateCastBehavior: ModuleScript;
				};
			};
			ore: Folder & {
				ore: ModuleScript;
			};
			vr: Folder & {
				setupvr: ModuleScript;
			};
			build: Folder & {
				methods: ModuleScript & {
					activate: ModuleScript;
				};
				mod: ModuleScript;
				helpers: ModuleScript & {
					getItemMod: ModuleScript;
					dragUpdate: ModuleScript;
					onPlace: ModuleScript;
					startOrUpdateTween: ModuleScript;
					configureItemGuide: ModuleScript;
					setNewItem: ModuleScript;
					makeItemColor: ModuleScript;
					canPlaceItem: ModuleScript;
				};
				constants: ModuleScript;
			};
		};
		util: Folder & {
			moduleGet: ModuleScript;
		};
	};
	VRTools: Folder & {
		Inventory: Tool & {
			Handle: Part;
			GUI: BillboardGui & {
				Frame: Frame & {
					Inventory: TextLabel;
					UIPadding: UIPadding;
					Category: Frame & {
						Right: TextLabel;
						Left: TextLabel;
						CategoryName: TextLabel;
					};
					UICorner: UICorner;
					BuyButton: TextButton & {
						UICorner: UICorner;
						Frame: Frame;
					};
					Item: Frame & {
						ItemName: TextLabel;
						Left: TextLabel;
						Right: TextLabel;
					};
					Viewport: Frame & {
						ViewportFrame: ViewportFrame;
					};
				};
			};
		};
		Sell: Tool & {
			Handle: Part;
		};
		Shop: Tool & {
			Handle: Part;
			GUI: BillboardGui & {
				Frame: Frame & {
					BuyButton: TextButton & {
						UICorner: UICorner;
						Frame: Frame;
					};
					UIPadding: UIPadding;
					Category: Frame & {
						Right: TextLabel;
						Left: TextLabel;
						CategoryName: TextLabel;
					};
					Money: TextLabel;
					Item: Frame & {
						ItemName: TextLabel;
						Left: TextLabel;
						Right: TextLabel;
					};
					Viewport: Frame & {
						ViewportFrame: ViewportFrame;
					};
					UICorner: UICorner;
				};
			};
		};
		["Put Away"]: Tool & {
			Handle: Part;
		};
	};
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
			["@rbxgar"]: Folder & {
				proxy: Folder & {
					dist: Folder & {
						mod: ModuleScript;
					};
				};
				camera: Folder & {
					dist: Folder & {
						mod: ModuleScript;
					};
				};
				fastcast: Folder & {
					dist: Folder & {
						mod: ModuleScript;
					};
				};
				collection: Folder & {
					dist: Folder & {
						mod: ModuleScript;
					};
				};
				basemodule: Folder & {
					dist: Folder & {
						mod: ModuleScript;
					};
				};
				event: Folder & {
					dist: Folder & {
						mod: ModuleScript;
					};
				};
				build: Folder & {
					dist: Folder & {
						mod: ModuleScript;
					};
				};
			};
			["@rbxts"]: Folder & {
				types: Folder & {
					include: Folder & {
						generated: Folder;
					};
				};
				["compiler-types"]: Folder & {
					types: Folder;
				};
				services: ModuleScript;
			};
		};
	};
}
