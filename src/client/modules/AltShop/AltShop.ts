import { BigNumber } from "shared/modules/BigNumber/BigNumber";
import { Money } from "../Money/Money";
import { Players, RunService, TweenService, Workspace } from "@rbxts/services";
import { Input } from "../Input/Input";
import { Common } from "shared/modules/Common/Common";
import { Inventory } from "../Inventory/Inventory";
import { Scheduling } from "shared/modules/Scheduling/Scheduling";


export namespace AltShop {
    const Price = new BigNumber(20);
    const AltShop = Workspace.WaitForChild("Environment").WaitForChild("AltShop") as Workspace["Environment"]["AltShop"];

    export const GetAltShopPrice = () => {
        return Price;
    }

    const GetRandomRot = (Rot: number) => {
        const Rand = math.random(1, 3);
        if (Rand === 1) {
            Rot += math.rad(3);
        } else if (Rand === 2) {
            Rot += math.rad(0);
        } else {
            Rot += math.rad(-3);
        }

        if (Rot >= math.rad(360)) {
            Rot -= math.rad(360);
        }

        if (Rot < 0) {
            Rot += math.rad(360);
        }

        return Rot;
    }

    export const RollAltShop = () => {
        if (Money.GetAltCurrency().IsLessThan(Price)) return false;

        const PlayerUI = Players.LocalPlayer.WaitForChild("PlayerGui") as StarterGui;
        AltShop.ProximityPrompt.Enabled = false;
        PlayerUI.MainUI.Left.Visible = false;
        Input.Instance().PauseInputs();

        Money.RemoveAltCurrency(Price);

        const Camera = Workspace.CurrentCamera!;
        const CamCFrameRestore = Camera.CFrame;
        const CamTypeRestore = Camera.CameraType;

        const ScalingModel = new Instance("Model");
        ScalingModel.Parent = AltShop;

        Camera.CameraType = Enum.CameraType.Scriptable;

        const TweenDir = 1;
        const Scale = 0.2;

        const CameraTween = new TweenInfo(TweenDir, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, 0, false);
        TweenService.Create(Camera, CameraTween, {
            CFrame: CFrame.lookAt(AltShop.Base.Container.Cam.WorldCFrame.Position, AltShop.Base.Container.Item.WorldCFrame.Position),
        }).Play();

        const AltShopItems = Common.GetAllAltShopItems();

        const ActualGiven = AltShopItems.Random()!.Clone();
        Inventory.AddItem(tonumber(ActualGiven.Name) || 10000, ActualGiven.Stats.InAltShop.Value);

        wait(TweenDir);

        AltShop.Base.Container.Sparks.Enabled = true;

        let elapsedTime: number = 0
        let currentItem: PossibleItems = AltShopItems.Random()!.Clone();
        
        currentItem.Parent = ScalingModel;
        ScalingModel.ScaleTo(Scale);

        let x = 0;
        let y = 0;
        let z = 0;

        const TpInt: number = 0.1;
        const SpinDuration: number = 5;

        const Connection = RunService.Heartbeat.Connect((deltaTime: number) => {
            elapsedTime += deltaTime

            if (elapsedTime >= TpInt) {
                elapsedTime = elapsedTime - TpInt;

                // Choose a new random item
                const NewItem = AltShopItems.Random()!.Clone();

                // If the item changes, maintain the current rotation
                if (NewItem.Name !== currentItem.Name) {
                    currentItem.Destroy();
                    ScalingModel.ScaleTo(1);

                    currentItem = NewItem
                    currentItem.Parent = ScalingModel;
                    ScalingModel.ScaleTo(Scale);
                }

                x = GetRandomRot(x);
                y = GetRandomRot(y);
                z = GetRandomRot(z);

                currentItem.CFrame = AltShop.Base.Container.Item.WorldCFrame.mul(CFrame.Angles(x, y, z));
            }
        });

        wait(SpinDuration);

        // Clean up
        Connection.Disconnect();

        currentItem.Destroy();
        ScalingModel.ScaleTo(1);
        ActualGiven.Parent = ScalingModel;
        ScalingModel.ScaleTo(Scale);
        ActualGiven.CFrame = AltShop.Base.Container.Item.WorldCFrame.mul(CFrame.Angles(x, y, z));

        const T = TweenService.Create(Camera, CameraTween, {
            CFrame: CamCFrameRestore,
        });

        const TC = T.Completed.Connect(() => {
            TC.Disconnect();
            ActualGiven.Destroy();
            ScalingModel.Destroy();
            AltShop.Base.Container.Sparks.Enabled = false;
            PlayerUI.MainUI.Left.Visible = true;
            Camera.CameraType = CamTypeRestore;
            AltShop.ProximityPrompt.Enabled = true;
            Input.Instance().ResumeInputs();
        });

        const InfoFrame = PlayerUI.MainUI.Bottom.ItemActionInfo;
        InfoFrame.Info.ItemName.Text = ActualGiven.Stats.ItemName.Value + " x" + ActualGiven.Stats.InAltShop.Value;
        InfoFrame.ItemIcon.Image = ActualGiven.Stats.Icon.Value;
        InfoFrame.Visible = true;

        Scheduling.SetTimeout(() => {
            InfoFrame.Visible = false;
        }, 3);

        T.Play();

        wait(TweenDir);

        return true;
    }

    export const SetAltObjectText = (str: string) => {
        AltShop.ProximityPrompt.ObjectText = str;
    }
}