class Node<T> {
    Value: T;
    Next: Node<T> | undefined;

    constructor(Value: T) {
        this.Value = Value;
        this.Next = undefined;
    }
}

export class LinkedList<T> {
    private Head: Node<T> | undefined;
    private Tail: Node<T> | undefined;
    private Size: number;

    constructor() {
        this.Head = undefined;
        this.Tail = undefined;
        this.Size = 0;
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
