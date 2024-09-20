import { Players, RunService } from "@rbxts/services";
import { GridOld } from "./Grid";
import { BaseItem } from "../../Item/BaseItem";
import { ItemFacingDirection } from "../../Item/Common";
import { Collection } from "shared/modules/Collection/Collection";
import { Input } from "../../Input/Input";

const TWEEN_DURATION = 0.20;

export class DragGrid {
    /* private static _instance?: DragGrid;

    private PlayerGui: PlayerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;
    private DragUI: StarterGui["GridDragGUI"] = this.PlayerGui.WaitForChild("GridDragGUI") as StarterGui["GridDragGUI"];

    private CellCache: Collection<string, CellInfo> = new Collection();
    private RunningTweens: Collection<string, CellInfo> = new Collection();

    private Connections: Array<RBXScriptConnection> = [];

    private constructor() {
        Input.Controls.KeyboardMouse.GridItemPlace.SetConditionalIgnoreGuiFunc(G => {
            return G.IsDescendantOf(this.DragUI);
        });

        // Start an update loop to handle manual tweening
        const Conn = RunService.Heartbeat.Connect((dt) => this.UpdateTweens(dt));
        this.Connections.push(Conn);
    }

    public static Instance(): DragGrid {
        return DragGrid._instance || (DragGrid._instance = new DragGrid());
    }

    public DestroyCells() {
        this.CellCache.ForEach(CellInfo => {
            CellInfo.Cell.Destroy();
        });
        this.CellCache.Clear();
        this.RunningTweens.Clear();  // Clear any running tweens
    }

    public Disconnect() {
        DragGrid._instance = undefined;
        this.Connections.forEach((Connection) => Connection.Disconnect());
    }

    public PlaceGuiCell(CF: CFrame, Mod: BaseItem): GuiObject {
        const VPCell = this.DragUI.TemplateVPCell;
        const GridBottomLeft = GridOld.Instance().GetGridBottomLeftCF();
        const GridTopRight = GridOld.Instance().GetGridTopRightCF();
        const ItemSize = GridOld.Instance().GetItemSizeInCellsXY();
        const CellSize = GridOld.Instance().GetCellSize();

        const Y = (CF.Position.X - GridBottomLeft.Position.X) / (GridTopRight.Position.X - GridBottomLeft.Position.X);
        const X = (CF.Position.Z - GridBottomLeft.Position.Z) / (GridTopRight.Position.Z - GridBottomLeft.Position.Z);

        const PixPerStud = this.DragUI.PixelsPerStud;
        const OffsetX = -ItemSize.Y / 2 * CellSize * PixPerStud;
        const OffsetY = -ItemSize.X / 2 * CellSize * PixPerStud;

        const Clone = VPCell.Clone();
        Clone.Parent = this.DragUI;
        Clone.Visible = true;
        Clone.Position = new UDim2(X, OffsetX, Y, OffsetY);
        
        const TargetSize = new UDim2(0, ItemSize.Y * PixPerStud * CellSize, 0, ItemSize.X * PixPerStud * CellSize);
        const InitialSize = Clone.Size;
    
        const Model = Mod.AsModel();
        Model.Parent = Clone.Frame.ViewportFrame;
        Model.PivotTo(new CFrame(0, -0.5, -14).mul(CFrame.Angles(0, math.rad(-30), 0)));

        const Arrow = Clone.Frame.Arrow;
        const ItemFaceDir = Mod.GetFacingDirection();

        switch (ItemFaceDir) {
            case ItemFacingDirection.North:
                Arrow.Rotation = 90;
                break;
            case ItemFacingDirection.East:
                Arrow.Rotation = 180;
                break;
            case ItemFacingDirection.South:
                Arrow.Rotation = 270;
                break;
            case ItemFacingDirection.West:
                Arrow.Rotation = 0;
                break;
            default:
                Arrow.Destroy();
        }

        // Create CellInfo and set up manual tweening
        const CI = new CellInfo(Clone, InitialSize, TargetSize);
        this.CellCache.Set(CF.Position.X + "," + CF.Position.Z, CI);
        this.RunningTweens.Set(CF.Position.X + "," + CF.Position.Z, CI);  // Add to the list of active tweens

        return Clone;
    }

    public UndragCell(CF: CFrame) {
        const CellInfo = this.CellCache.Get(CF.Position.X + "," + CF.Position.Z);
        if (CellInfo === undefined) return;
        CellInfo.Cell.Destroy();
        this.CellCache.Delete(CF.Position.X + "," + CF.Position.Z);

        // Remove the tween from the runningTweens array
        this.RunningTweens.Delete(CF.Position.X + "," + CF.Position.Z);
    }

    private UpdateTweens(dt: number) {
        // Iterate over all running tweens and update their sizes
        for (const [CF, Tween] of this.RunningTweens.Entries()) {
            Tween.ElapsedTime += dt;
            const Alpha = math.min(Tween.ElapsedTime / TWEEN_DURATION, 1);  // Scale from 0 to 1
            Tween.Cell.Size = Tween.InitialSize.Lerp(Tween.TargetSize, Alpha);

            // If tween is complete, mark it as done and remove it from the list
            if (Alpha === 1) {
                this.RunningTweens.Delete(CF);
            }
        }
    } */
}

class CellInfo {
    public Cell: Frame;
    public InitialSize: UDim2;
    public TargetSize: UDim2;
    public ElapsedTime: number = 0;

    constructor(Cell: Frame, InitialSize: UDim2, TargetSize: UDim2) {
        this.Cell = Cell;
        this.InitialSize = InitialSize;
        this.TargetSize = TargetSize;
    }
}
