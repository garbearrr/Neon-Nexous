import { Collection } from "../Collection/Collection";

class Node<T> {
    public Value: T;
    public Next: Node<T> | undefined;

    constructor(Value: T) {
        this.Value = Value;
        this.Next = undefined;
    }
}

export class LinkedList<T> {
    protected Head: Node<T> | undefined;
    protected Tail: Node<T> | undefined;
    protected Size: number;

    constructor(...values: T[]) {
        this.Head = undefined;
        this.Tail = undefined;
        this.Size = 0;

        for (const value of values) {
            this.Add(value);
        }
    }

    // Add a value to the end of the list
    Add(value: T): void {
        const newNode = new Node(value);

        if (!this.Head) {
            this.Head = newNode;
            this.Tail = newNode;
        } else {
            this.Tail!.Next = newNode;
            this.Tail = newNode;
        }

        this.Size++;
    }

    // Add a value to the front of the list
    AddFront(value: T): void {
        const newNode = new Node(value);

        if (!this.Head) {
            this.Head = newNode;
            this.Tail = newNode;
        } else {
            newNode.Next = this.Head;
            this.Head = newNode;
        }

        this.Size++;
    }

    // Remove a value from the list
    Remove(value: T): boolean {
        if (!this.Head) return false;

        if (this.Head.Value === value) {
            this.Head = this.Head.Next;
            this.Size--;
            if (this.Size === 0) this.Tail = undefined;
            return true;
        }

        let current = this.Head;
        while (current.Next) {
            if (current.Next.Value === value) {
                current.Next = current.Next.Next;
                this.Size--;
                if (current.Next === undefined) this.Tail = current;
                return true;
            }
            current = current.Next;
        }

        return false;
    }

    // Remove with index
    RemoveAt(index: number): boolean {
        if (index < 0 || index >= this.Size) return false;

        if (index === 0) {
            this.Head = this.Head!.Next;
            this.Size--;
            if (this.Size === 0) this.Tail = undefined;
            return true;
        }

        let current = this.Head;
        let count = 0;

        while (current?.Next) {
            if (count + 1 === index) {
                current.Next = current.Next.Next;
                this.Size--;
                if (current.Next === undefined) this.Tail = current;
                return true;
            }
            current = current.Next;
            count++;
        }

        return false;
    }

    // Get a value at a specific index
    Get(index: number): T | undefined {
        if (index < 0 || index >= this.Size) return undefined;

        let current = this.Head;
        let count = 0;

        while (current) {
            if (count === index) return current.Value;
            current = current.Next;
            count++;
        }

        return undefined;
    }

    GetHead(): T | undefined {
        return this.Head?.Value;
    }

    // Get the size of the list
    GetSize(): number {
        return this.Size;
    }

    GetTail(): T | undefined {
        return this.Tail?.Value;
    }

    // Traverse the list and apply a function to each element
    ForEach(callback: (value: T, index: number) => void): void {
        let current = this.Head;
        let index = 0;

        while (current) {
            callback(current.Value, index);
            current = current.Next;
            index++;
        }
    }

    // Clear the list
    Clear(): void {
        this.Head = undefined;
        this.Tail = undefined;
        this.Size = 0;
    }

    // Check if the list is empty
    IsEmpty(): boolean {
        return this.Size === 0;
    }

    // A method that slices off the end of the linked list at an index inclusive (essentially setting the previous index's next to undefined)
    Slice(index: number): void {
        if (index < 0 || index >= this.Size) return;

        if (index === 0) {
            this.Head = undefined;
            this.Tail = undefined;
            this.Size = 0;
            return;
        }

        let current = this.Head;
        let count = 0;

        while (current?.Next) {
            if (count + 1 === index) {
                current.Next = undefined;
                this.Tail = current;
                this.Size = index + 1;
                return;
            }
            current = current.Next;
            count++;
        }
    }
}

export class LinkedListCollection<KeyType extends defined, T extends defined> extends LinkedList<T> {
    public readonly Collection = new Collection<KeyType, T>();

    constructor(...values: T[]) {
        super(...values);
    }

    public override Clear(): void {
        super.Clear();
        this.Collection.Clear();
    }

    public ForEachWithKey(callback: (value: T, key: KeyType, index: number) => void): void {
        let current = this.Head;
        let index = 0;

        while (current) {
            const Key = this.Collection.FindKey((V, K) => V === current?.Value);
            if (Key !== undefined) callback(current.Value, Key, index);
            current = current.Next;
            index++;
        }
    }

    public override Remove(value: T): boolean {
        const Key = this.Collection.FindKey((V, _K) => V === value);
        if (Key !== undefined) return this.Collection.Delete(Key);
        return super.Remove(value);
    }

    public override RemoveAt(index: number): boolean {
        const Value = this.Get(index);
        if (Value !== undefined) return this.Remove(Value);
        return false;
    }

    public RemoveViaKey(key: KeyType): boolean {
        const Value = this.Collection.Get(key);
        if (Value !== undefined) return this.Remove(Value);
        return false;
    }

    public SetAdd(key: KeyType, value: T): void {
        super.Add(value);
        this.Collection.Set(key, value);
    }

    public SetAddFront(key: KeyType, value: T): void {
        super.AddFront(value);
        this.Collection.Set(key, value);
    }
}