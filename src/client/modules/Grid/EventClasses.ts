import { LinkedListCollection } from "shared/modules/LinkedList/LinkedList";

export class OnMove {
    public ItemId: number;
    public Pos: Vector3;
    public Rot: Vector3;

    public constructor(ItemId: number, Pos: Vector3, Rot: Vector3) {
        this.ItemId = ItemId;
        this.Pos = Pos;
        this.Rot = Rot;
    }
}

export class OnPlace {
    public ItemId: number;
    public CF: LinkedListCollection<string, CFrame>;

    public constructor(ItemId: number, CF: LinkedListCollection<string, CFrame>) {
        this.ItemId = ItemId;
        this.CF = CF;
    }
}

export class OnUpdate {
    public CF: LinkedListCollection<string, CFrame>;
    public ItemId: number;

    public constructor(ItemId: number, CF: LinkedListCollection<string, CFrame>) {
        this.ItemId = ItemId;
        this.CF = CF;
    }   
}