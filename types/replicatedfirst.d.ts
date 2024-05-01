interface ReplicatedFirst extends Instance {
	TS: Folder & {
		main: LocalScript;
	};
	LoadEvent: BindableEvent;
	LoadingScreen: ScreenGui & {
		LoadingFrame: Frame & {
			AssetText: TextLabel;
			UIPadding: UIPadding;
			LoadingText: TextLabel;
		};
	};
}
