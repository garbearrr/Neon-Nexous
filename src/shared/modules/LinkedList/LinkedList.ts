import { Collection } from "../Collection/Collection";

class Node<T> {
    public Value: T;
    public Next: Node<T> | undefined;
    public Previous: Node<T> | undefined;

    constructor(Value: T) {
        this.Value = Value;
        this.Next = undefined;
        this.Previous = undefined;
    }
}


export class LinkedList<T extends defined> {
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

        if (this.Head === undefined) {
            this.Head = newNode;
            this.Tail = newNode;
        } else {
            newNode.Previous = this.Tail;
            this.Tail!.Next = newNode;
            this.Tail = newNode;
        }

        this.Size++;
    }

    // Add a value to the front of the list
    AddFront(value: T): void {
        const newNode = new Node(value);

        if (this.Head === undefined) {
            this.Head = newNode;
            this.Tail = newNode;
        } else {
            newNode.Next = this.Head;
            this.Head.Previous = newNode;
            this.Head = newNode;
        }

        this.Size++;
    }

    // Remove a value from the list
    Remove(value: T): boolean {
        if (this.Head === undefined) return false;

        let current: Node<T> | undefined = this.Head;

        while (current !== undefined) {
            if (current.Value === value) {
                if (current.Previous !== undefined) {
                    current.Previous.Next = current.Next;
                } else {
                    // Removing the head
                    this.Head = current.Next;
                }

                if (current.Next !== undefined) {
                    current.Next.Previous = current.Previous;
                } else {
                    // Removing the tail
                    this.Tail = current.Previous;
                }

                this.Size--;
                return true;
            }
            current = current.Next;
        }

        return false;
    }

    // Remove with index
    RemoveAt(index: number): boolean {
        if (index < 0 || index >= this.Size) return false;

        let current = this.Head;
        let count = 0;

        while (current !== undefined) {
            if (count === index) {
                if (current.Previous !== undefined) {
                    current.Previous.Next = current.Next;
                } else {
                    // Removing the head
                    this.Head = current.Next;
                }

                if (current.Next !== undefined) {
                    current.Next.Previous = current.Previous;
                } else {
                    // Removing the tail
                    this.Tail = current.Previous;
                }

                this.Size--;
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

        while (current !== undefined) {
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

    // Traverse the list forward and apply a function to each element
    ForEach(callback: (value: T, index: number) => void): void {
        let current = this.Head;
        let index = 0;

        while (current !== undefined) {
            callback(current.Value, index);
            current = current.Next;
            index++;
        }
    }

    // Traverse the list backward and apply a function to each element
    ForEachReverse(callback: (value: T, index: number) => void): void {
        let current = this.Tail;
        let index = this.Size - 1;

        while (current !== undefined) {
            callback(current.Value, index);
            current = current.Previous;
            index--;
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

    // A method that slices off the end of the linked list at an index inclusive
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

        while (current !== undefined) {
            if (count === index) {
                if (current.Previous !== undefined) {
                    current.Previous.Next = undefined;
                }
                this.Tail = current.Previous;
                this.Size = index;
                return;
            }
            current = current.Next;
            count++;
        }
    }

    // Update the value at a specific index
    Update(value: T, index: number): boolean {
        if (index < 0 || index >= this.Size) {
            return false;
        }

        let current = this.Head;
        let count = 0;

        while (current !== undefined) {
            if (count === index) {
                current.Value = value;
                return true;
            }
            current = current.Next;
            count++;
        }

        return false;
    }

    // Insert a value at a specific index
    Insert(value: T, index: number): boolean {
        if (index < 0 || index > this.Size) {
            return false;
        }

        const newNode = new Node(value);

        if (index === 0) {
            newNode.Next = this.Head;
            if (this.Head !== undefined) {
                this.Head.Previous = newNode;
            }
            this.Head = newNode;
            if (this.Size === 0) {
                this.Tail = newNode;
            }
            this.Size++;
            return true;
        }

        let current = this.Head;
        let count = 0;

        while (current !== undefined) {
            if (count === index - 1) {
                newNode.Next = current.Next;
                newNode.Previous = current;
                if (current.Next !== undefined) {
                    current.Next.Previous = newNode;
                } else {
                    // Inserting at the tail
                    this.Tail = newNode;
                }
                current.Next = newNode;
                this.Size++;
                return true;
            }
            current = current.Next;
            count++;
        }

        return false;
    }

    // Convert the linked list to an array
    ToArray(): T[] {
        const array: T[] = [];
        let current = this.Head;
        while (current !== undefined) {
            array.push(current.Value);
            current = current.Next;
        }
        return array;
    }

    // Find a node based on a predicate
    Find(predicate: (value: T, index: number) => boolean): Node<T> | undefined {
        let current = this.Head;
        let index = 0;

        while (current !== undefined) {
            if (predicate(current.Value, index)) {
                return current;
            }
            current = current.Next;
            index++;
        }

        return undefined;
    }
}


export class LinkedListCollection<KeyType extends defined, T extends defined> extends LinkedList<T> {
    public readonly Collection = new Collection<KeyType, T>();
    private readonly keyToNodeMap: Map<KeyType, Node<T>> = new Map<KeyType, Node<T>>();

    constructor(...values: [KeyType, T][]) {
        super();
        for (const [key, value] of values) {
            this.SetAdd(key, value);
        }
    }

    public override Clear(): void {
        super.Clear();
        this.Collection.Clear();
        this.keyToNodeMap.clear();
    }

    public ForEachWithKey(callback: (value: T, key: KeyType, index: number) => void): void {
        let current = this.Head;
        let index = 0;

        while (current !== undefined) {
            const Key = this.Collection.FindKey((V, K) => V === current!.Value);
            if (Key !== undefined) callback(current.Value, Key, index);
            current = current.Next;
            index++;
        }
    }

    public ForEachWithKeyReverse(callback: (value: T, key: KeyType, index: number) => void): void {
        let current = this.Tail;
        let index = this.Size - 1;

        while (current !== undefined) {
            const Key = this.Collection.FindKey((V, K) => V === current!.Value);
            if (Key !== undefined) callback(current.Value, Key, index);
            current = current.Previous;
            index--;
        }
    }

    public GetNodeViaKey(key: KeyType): Node<T> | undefined {
        return this.keyToNodeMap.get(key);
    }

    public override Remove(value: T): boolean {
        const success = super.Remove(value);
        if (success) {
            const key = this.Collection.FindKey((V, K) => V === value);
            if (key !== undefined) {
                this.Collection.Delete(key);
                this.keyToNodeMap.delete(key);
            }
        }
        return success;
    }

    public override RemoveAt(index: number): boolean {
        const value = this.Get(index);
        if (value === undefined) return false;
        const success = super.RemoveAt(index);
        if (success) {
            const key = this.Collection.FindKey((V, K) => V === value);
            if (key !== undefined) {
                this.Collection.Delete(key);
                this.keyToNodeMap.delete(key);
            }
        }
        return success;
    }

    public RemoveViaKey(key: KeyType): boolean {
        const Value = this.Collection.Get(key);
        if (Value !== undefined) return this.Remove(Value);
        return false;
    }

    public SetAdd(key: KeyType, value: T): void {
        const existingNode = this.GetNodeViaKey(key);
        if (existingNode !== undefined) {
            // Update the existing node's value
            existingNode.Value = value;
            this.Collection.Set(key, value);
        } else {
            // Add a new node as usual
            super.Add(value);
            this.Collection.Set(key, value);
            const node = this.Find((nodeValue) => nodeValue === value);
            if (node !== undefined) {
                this.keyToNodeMap.set(key, node);
            }
        }
    }
    
    public SetAddFront(key: KeyType, value: T): void {
        const existingNode = this.GetNodeViaKey(key);
        if (existingNode !== undefined) {
            // Update the existing node's value
            existingNode.Value = value;
            this.Collection.Set(key, value);
        } else {
            // Add a new node to the front as usual
            super.AddFront(value);
            this.Collection.Set(key, value);
            const node = this.Find((nodeValue) => nodeValue === value);
            if (node !== undefined) {
                this.keyToNodeMap.set(key, node);
            }
        }
    }

    /**
     * Updates the value at the specified index and synchronizes the Collection.
     * @param value - The new value to set.
     * @param index - The index of the node to update.
     * @returns `true` if the update was successful, `false` otherwise.
     */
    public override Update(value: T, index: number): boolean {
        const success = super.Update(value, index);
        if (!success) {
            return false;
        }

        // Traverse to the node at the specified index
        let current = this.Head;
        let count = 0;
        let targetKey: KeyType | undefined;

        while (current !== undefined) {
            if (count === index) {
                targetKey = this.Collection.FindKey((V, K) => V === current!.Value);
                break;
            }
            current = current.Next;
            count++;
        }

        if (targetKey !== undefined) {
            this.Collection.Set(targetKey, value);
            const node = this.GetNodeViaKey(targetKey);
            if (node !== undefined) {
                node.Value = value;
            }
            return true;
        }

        return false;
    }

    /**
     * Inserts a key-value pair at the specified index.
     * @param key - The key associated with the value.
     * @param value - The value to insert.
     * @param index - The position to insert the new value.
     * @returns `true` if the insertion was successful, `false` otherwise.
     */
    public InsertWithKey(key: KeyType, value: T, index: number): boolean {
        const success = super.Insert(value, index);
        if (!success) {
            return false;
        }
        this.Collection.Set(key, value);
        const node = this.GetNodeViaKey(key);
        if (node !== undefined) {
            this.keyToNodeMap.set(key, node);
        }
        return true;
    }

    /**
     * Updates the value associated with the specified key.
     * @param key - The key whose value needs to be updated.
     * @param newValue - The new value to set.
     * @returns `true` if the update was successful, `false` otherwise.
     */
    public UpdateByKey(key: KeyType, newValue: T): boolean {
        const node = this.keyToNodeMap.get(key);
        if (node === undefined) {
            return false; // Key does not exist
        }

        // Update the node's value
        node.Value = newValue;

        // Update the Collection
        this.Collection.Set(key, newValue);

        return true;
    }
}

