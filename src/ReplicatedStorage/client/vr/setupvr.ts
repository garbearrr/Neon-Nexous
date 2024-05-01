import { ContextActionService, GuiService, Players, ReplicatedStorage, UserInputService, VRService, Workspace } from "@rbxts/services"
import { BaseClientItem } from "../item/types";
import { addItemToInventory } from "../inventory/addItem";
import { getItemMod } from "../build/helpers/getItemMod";
import { BuildModule } from "ReplicatedStorage/modules/build/types";
import { Build } from "ReplicatedStorage/modules/build/build";
import { dragUpdate, onPlace, startOrUpdateTween } from "../build/helpers";
import { ClientBuild } from "../build/mod";
import { ClientInspect } from "../inspect/inspect";

type categories = "Conveyors" | "Droppers" | "Furnaces" | "Upgraders";

const getItem = (id: string, category: string) => {
    const Children = Workspace.Items[category as categories].GetChildren();
    for (const Child of Children) {
        const ID = Child.FindFirstChild(id);
        if ( ID !== undefined ) return ID as BaseClientItem;
    }
}

export const setupVR = () => {
    if (!VRService.VREnabled) return false;

    _G.VR = true;
    _G.ShopItems = {
        Conveyors: [{vp: "ConveyorViewport", id: "30000"}],
        Droppers: [{vp: "DropperViewport", id: "10000"}],
        Furnaces: [{vp: "FurnaceViewport", id: "20000"}],
        Upgraders: [{vp: "UpgraderViewport", id: "40000"}, {vp: "GateViewport", id: "40001"}]
    }

    _G.Inventory.Set("10000", 50);
    _G.Inventory.Set("20000", 50);
    _G.Inventory.Set("30000", 50);
    _G.Inventory.Set("40000", 50);
    _G.Inventory.Set("40001", 50);

    const Player = Players.LocalPlayer;
    const Chararacter = Player.Character;
    Chararacter?.FindFirstChild("Head")?.FindFirstChild("face")?.Destroy();
    Chararacter?.FindFirstChild("Head")?.FindFirstChild("Mesh")?.Destroy();

    const NVR = require(ReplicatedStorage.WaitForChild("NexusVRCharacterModel") as ModuleScript) as NexusVRCharacterModel;
    try{NVR.Api.Register("Backpack", "Backpack");} catch(_e: unknown){}
    try{NVR.Api.Register("Controller", "Controller");} catch(_e: unknown){}
    const Backpack = NVR.Api.Backpack;
    Backpack.SetBackpackEnabled(true);
    Backpack.SetKeyCode(Enum.KeyCode.ButtonL3);

    const Inventory = ReplicatedStorage.VRTools.Inventory;
    const Store = ReplicatedStorage.VRTools["Put Away"];
    const Sell = ReplicatedStorage.VRTools.Sell;
    const Shop = ReplicatedStorage.VRTools.Shop;
    const Money = ReplicatedStorage.VRTools.FindFirstChild("Money") as Tool;

    const PlayerBackpack = Player.FindFirstChild("Backpack") as Backpack;
    Inventory.Parent = PlayerBackpack;
    Store.Parent = PlayerBackpack;
    Sell.Parent = PlayerBackpack;
    Shop.Parent = PlayerBackpack;
    Money.Parent = PlayerBackpack;

    _G.Money = 100;
    Money.Name = "$100";

    //const ViewportCamera = new Instance("Camera");

    let currentGUI: ReplicatedStorage["VRTools"]["Shop"]["GUI"]["Frame"] | undefined;

    let selectedElement: GuiObject;
    let originalSEColor: Color3;
    let originalSETransparency: number;

    let currentVP: ViewportFrame | undefined;

    let currentCategory = 0;
    let currentItem = 0;

    let shop = true;

    let building = false;

    const ClientInspectMod = ClientInspect();
    ClientInspectMod.Enable();

    const TempItem = Workspace.Items.Droppers["Erbium Mine"]["10000"] as BaseClientItem;
    const ClientB = ClientBuild(TempItem, ClientInspectMod);
    ClientB.Activate();

    Store.Equipped.Connect(() => {
        ClientInspectMod.SetVRToolEquipped("Put Away");
        ClientInspectMod.Enable();
    });

    Store.Unequipped.Connect(() => {
        ClientInspectMod.SetVRToolEquipped(undefined);
        ClientInspectMod.Disable();
    });

    Sell.Equipped.Connect(() => {
        ClientInspectMod.SetVRToolEquipped("Sell");
        ClientInspectMod.Enable();
    });

    Sell.Unequipped.Connect(() => {
        ClientInspectMod.SetVRToolEquipped(undefined);
        ClientInspectMod.Disable();
    });

    Shop.Equipped.Connect((Mouse: Mouse) => {
        const GUI = (Player.WaitForChild("PlayerGui").WaitForChild("ShopGUI") as ReplicatedStorage["VRTools"]["Shop"]["GUI"]).Frame;
        GUI.Money.Text = `$${_G.Money}`;
        GUI.Category.CategoryName.Text = "Droppers";

        shop = true;

        currentGUI = GUI;
        GUI.Visible = true;

        currentVP = GUI.FindFirstChild("DropperViewport") as ViewportFrame;

        const Item = getItem("10000", "Droppers") as BaseClientItem;
        GUI.Item.ItemName.Text = Item.Stats.ItemName.Value;

        //const ItemClone = Item.Clone();
        //ItemClone.Parent = Workspace;
        //ItemClone.CFrame = new CFrame(0, -0.5, -14).mul(CFrame.Angles(0, math.rad(-30), 0));
        //ItemClone.Parent = GUI.Viewport.ViewportFrame;

        //ItemClone.FindFirstChild("Ore")?.Destroy();

        selectedElement = GUI.Category;
        originalSEColor = selectedElement.BackgroundColor3;
        originalSETransparency = selectedElement.BackgroundTransparency;
        GUI.Category.BackgroundTransparency = 0.8;
        GUI.Category.BackgroundColor3 = new Color3(0.07, 0.55, 0.83);

        GUI.BuyButton.Text = `Buy $${Item.Stats.Cost.Value}`;

        //ViewportCamera.Parent = GUI.Viewport.ViewportFrame;
        //GUI.Viewport.ViewportFrame.CurrentCamera = ViewportCamera;
        //ViewportCamera.CFrame = new CFrame(new Vector3(0, 2, 6), ItemClone.Position)
    });

    Shop.Unequipped.Connect(() => {
        selectedElement.BackgroundColor3 = originalSEColor;
        selectedElement.BackgroundTransparency = originalSETransparency;
        currentGUI!.Visible = false;
        currentGUI = undefined;
        currentCategory = 0;
        currentItem = 0;
    });

    Inventory.Equipped.Connect(() => {
        const GUI = (Player.WaitForChild("PlayerGui").WaitForChild("InvGUI") as ReplicatedStorage["VRTools"]["Shop"]["GUI"]).Frame;
        GUI.Category.CategoryName.Text = "Droppers";

        currentGUI = GUI;
        GUI.Visible = true;

        shop = false;

        currentVP = GUI.FindFirstChild("DropperViewport") as ViewportFrame;

        const Item = getItem("10000", "Droppers") as BaseClientItem;
        GUI.Item.ItemName.Text = Item.Stats.ItemName.Value;

        //const ItemClone = Item.Clone();
        //ItemClone.Parent = Workspace;
        //ItemClone.CFrame = new CFrame(0, -0.5, -14).mul(CFrame.Angles(0, math.rad(-30), 0));
        //ItemClone.Parent = GUI.Viewport.ViewportFrame;

        //ItemClone.FindFirstChild("Ore")?.Destroy();

        selectedElement = GUI.Category;
        originalSEColor = selectedElement.BackgroundColor3;
        originalSETransparency = selectedElement.BackgroundTransparency;
        GUI.Category.BackgroundTransparency = 0.8;
        GUI.Category.BackgroundColor3 = new Color3(0.07, 0.55, 0.83);

        (GUI.FindFirstChild("PlaceButton") as TextButton)!.Text = `Place x${_G.Inventory.Get("10000") ?? 0}`;
    });

    Inventory.Unequipped.Connect(() => {
        selectedElement.BackgroundColor3 = originalSEColor;
        selectedElement.BackgroundTransparency = originalSETransparency;
        currentGUI!.Visible = false;
        currentGUI = undefined;
        currentCategory = 0;
        currentItem = 0;

        building = false;

        ContextActionService.UnbindAction("Rotate");
        ContextActionService.UnbindAction("Place");
        ClientB.Get("BuildMod")?.Destroy();
        ClientB.Get("ItemGuide").Destroy();
        ClientInspectMod.Enable();
    });

    UserInputService.InputBegan.Connect((Input: InputObject) => {
        if (currentGUI === undefined) return;
        if (building === true) return;
        if (Input.KeyCode === Enum.KeyCode.ButtonY) {
            if (selectedElement === undefined) return;
            selectedElement.BackgroundColor3 = originalSEColor!;
            selectedElement.BackgroundTransparency = originalSETransparency!;

            selectedElement = selectedElement.NextSelectionDown as GuiObject;
            originalSEColor = selectedElement.BackgroundColor3;
            originalSETransparency = selectedElement.BackgroundTransparency;
            selectedElement.BackgroundColor3 = new Color3(0.07, 0.55, 0.83);
            selectedElement.BackgroundTransparency = 0.8;
        } else if (Input.KeyCode === Enum.KeyCode.ButtonX) {
            if (selectedElement === undefined) return;
            if (currentGUI === undefined) return;
            if (selectedElement.Name === "Category") {
                const Categories = ["Conveyors", "Droppers", "Furnaces", "Upgraders"];
                currentCategory = (currentCategory + 1) % Categories.size();
                currentItem = 0;
                currentGUI!.Category.CategoryName.Text = Categories[currentCategory];
                
                const CatData = _G.ShopItems[Categories[currentCategory] as categories];
                currentVP!.Visible = false;

                const VP = currentGUI!.FindFirstChild(CatData[currentItem].vp) as ViewportFrame;
                VP.Visible = true;
                currentVP = VP;

                const Item = getItem(CatData[currentItem].id, Categories[currentCategory]) as BaseClientItem;
                currentGUI!.Item.ItemName.Text = Item.Stats.ItemName.Value;
                if (shop === true)
                    currentGUI!.BuyButton.Text = `Buy $${Item.Stats.Cost.Value}`;
                else
                    (currentGUI!.FindFirstChild("PlaceButton") as TextButton)!.Text = `Place x${_G.Inventory.Get(tostring(Item.Stats.ItemId.Value)) ?? 0}`;
            } else if (selectedElement.Name === "Item") {
                const Categories = ["Conveyors", "Droppers", "Furnaces", "Upgraders"];
                const CatData = _G.ShopItems[Categories[currentCategory] as categories];
                currentItem = (currentItem + 1) % CatData.size();

                const VP = currentGUI!.FindFirstChild(CatData[currentItem].vp) as ViewportFrame;
                currentVP!.Visible = false;
                VP.Visible = true;
                currentVP = VP;

                const Item = getItem(CatData[currentItem].id, Categories[currentCategory]) as BaseClientItem;
                currentGUI!.Item.ItemName.Text = Item.Stats.ItemName.Value;
                if (shop === true)
                    currentGUI!.BuyButton.Text = `Buy $${Item.Stats.Cost.Value}`;
                else
                    (currentGUI!.FindFirstChild("PlaceButton") as TextButton)!.Text = `Place x${_G.Inventory.Get(tostring(Item.Stats.ItemId.Value)) ?? 0}`;
            } else if (selectedElement.Name === "PlaceButton") {
                currentGUI!.Visible = false;

                building = true;

                const Categories = ["Conveyors", "Droppers", "Furnaces", "Upgraders"];
                const CatData = _G.ShopItems[Categories[currentCategory] as categories];
                const Item = getItem(CatData[currentItem].id, Categories[currentCategory]) as BaseClientItem;

                ClientB.Activate(true, Item);
            }
        }
    });
    
    
    return true;
}