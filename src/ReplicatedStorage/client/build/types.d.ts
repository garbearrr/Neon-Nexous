import { BaseModule } from '@rbxgar/basemodule';
import { CameraModule } from '@rbxgar/camera';
import { Collection } from '@rbxgar/collection';
import { BuildModule } from 'ReplicatedStorage/modules/build/types';
import { BaseClientItem, ClientItemModule } from '../item/types';
import { ClientInspectModule } from '../inspect/types';
import { ReturnTypeBasedOnKey } from '../../../../types/util';

interface ClientBuildState {
    /**
     * The bound context actions for user input.
     */
    Actions: string[],
    BuildMod?: BuildModule;
    CamMod: CameraModule;
    Controls: {
        Activate: Enum.KeyCode;
        Rotate: Enum.KeyCode;
        Place: Enum.UserInputType;
    };
    CurrentTween?: Tween;
    DragCache: Collection<string, ClientItemModule>;
    InspectMod: ClientInspectModule;
    IsDestroyed: boolean;
    Item: BaseClientItem;
    ItemGuide: Part;
    TweenIsMoving: boolean;
}

interface ClientBuildMethods {
    Activate: (vr?: boolean, Item?: BaseClientItem) => void;
    Get: <K extends keyof ClientBuildState>(key: K) => Readonly<ReturnTypeBasedOnKey<ClientBuildState, K>>;
}

interface ClientBuildEvents {

}

type ClientBuildModule = BaseModule & ClientBuildMethods & ClientBuildEvents;